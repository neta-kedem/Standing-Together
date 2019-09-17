const Activist = require('../../models/activistModel');
const Mailer = require('../mailer');

const MAX_FAILED_LOGINS = 3;
const LOGIN_CODE_LENGTH = 12;
const LOCK_CODE_LENGTH = 32;
const TOKEN_LENGTH = 32;

const identifyViaEmail = function (email) {
    email = email.toLowerCase();
    const code = Math.random().toString(36).substr(2, LOGIN_CODE_LENGTH);
    const lockToken = generateLockToken();
    return Activist.findOneAndUpdate(
        {'profile.email': email},
        {
            $set: {
                'login.loginCode': code,
                'login.lockToken': lockToken
            }
        }).exec().then((doc) => {
            if(doc && doc.profile){
                sendCodeViaMail(code, lockToken, email);
            }
            return true;
        });
};

const loginViaMail = async function (email, code){
    email = email.toLowerCase();
    code = code.toLowerCase();
    const now = new Date();
    if(!code || code.length === 0)
        return {"error":"incorrect credentials"};
    if(!email)
        return {"error":"missing identification"};
    return Activist.findOne({'profile.email': email, 'login.loginCode': code}).exec().then((user) => {
        if(!user)
        {
            return Activist.updateOne(
                {'profile.email': email},
                {
                    $inc: {'login.failedLoginCount': 1},
                    'login.lastLoginAttempt': now,
                }
            ).exec().then(
                () => {
                    return {"error": "incorrect credentials"};
                }
            );
        }
        if(user.login.locked){
            return Activist.updateOne(
                {'_id': user._id},
                {
                    'login.lastLoginAttempt': now,
                },
            ).exec().then(
                () => {
                    return {"error": "locked"};
                }
            );
        }
        if(user.login.failedLoginCount > MAX_FAILED_LOGINS){
            return Activist.updateOne(
                {'_id': user._id},
                {
                    'login.lastLoginAttempt': now,
                    'login.locked': true
                },
            ).exec().then(
                () => {
                    return {"error": "tooManyLogins"};
                }
            );
        }
        return Activist.updateOne(
            {'_id': user._id},
            {
                'login.lastLoginAttempt': now,
                'login.failedLoginCount': 0
            },
        ).exec().then(
            () => {
                return assignToken(user._id).then((token) => {
                    return {"token": token, "permissions": user.role};
                });
            }
        );
    });
};

//this token is used to login into the system
const generateLoginToken = function() {
    let token = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(let i = 0; i < TOKEN_LENGTH; i++) {
        token += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return token;
};

//this token is used to lock access to the system in case of suspicious login attempts
const generateLockToken = function() {
    return Math.random().toString(36).substr(2, LOCK_CODE_LENGTH);
};

const assignToken = function(userId) {
    const now = new Date();
    const token = generateLoginToken();
    const query = Activist.updateOne(
        {'_id': userId},
        {
            $push: {'login.tokens': {"token": token, "issuedAt": now, "lastUsage": now}}
        }
    );
    return query.exec().then(()=>{
        return token
    });
};

const sendCodeViaMail = function(code, lockToken, email)
{
    const htmlBody = `
    <div dir="rtl" style="text-align: right;">
        <h3 style="color: #60076e">קוד הכניסה שלך למערכת של "עומדים ביחד": ${code}</h3>
        <p>הקוד הזה נשלח כחלק מניסיון התחברות למערכת באמצעות כתובת המייל הזאת.</p>
        <p style="background-color: #c00; color: white;">אם לא ניסית להיכנס למערכת, <a style="color: white;" href="https://management.standing-together.org/LockMe?lockToken=${lockToken}">נא ללחוץ כאן</a>.</p>
        <p>אחרי שמונה דקות של חוסר פעילות במערכת, תוקף הקוד יפוג, ותצטרכו להתחבר אליה מחדש.</p>
        <p>אם נכנסת למערכת ממחשב ציבורי, חשוב להתנתק בסוף העבודה הן מהמערכת עצמה, והן מחשבון המייל, שגישה אליו מאפשרת כניסה למערכת.</p>
    </div>
    `;
    const textBody = (
        "קוד הכניסה שלך למערכת של \"עומדים ביחד\": " + code + "\n" +
        "הקוד הזה נשלח כחלק מניסיון התחברות למערכת באמצעות כתובת המייל הזאת." + "\n" +
        "אם לא ניסית להיכנס למערכת, נא ללחוץ כאן:" + "\n" +
        "אחרי שמונה דקות של חוסר פעילות במערכת, תוקף הקוד יפוג, ותצטרכו להתחבר אליה מחדש." + "\n" +
        "https://management.standing-together.org/LockMe?lockToken=" + lockToken + "\n" +
        "אם נכנסת למערכת ממחשב ציבורי, חשוב להתנתק בסוף העבודה הן מהמערכת עצמה, והן מחשבון המייל, שגישה אליו מאפשרת כניסה למערכת." + "\n"
    );
    Mailer.sendEmail({
        from: 'info@standing-together.org',
        to: email,
        subject: 'Your login code for Standing Together',
        text: textBody,
        html: htmlBody
    });
};

module.exports = {
    identifyViaEmail,
    loginViaMail
};

