const Activist = require('../../models/activistModel');
const Mailer = require('../mailer');

const MAX_FAILED_LOGINS = 3;
const LOGIN_CODE_LENGTH = 12;
const LOCK_CODE_LENGTH = 32;
const TOKEN_LENGTH = 32;

const identifyViaEmail = function (email){
    email = email.toLowerCase();
    const code = Math.random().toString(36).substr(2, LOGIN_CODE_LENGTH);
    Activist.findOneAndUpdate({'profile.email':email}, {$set : {'login.loginCode': code}}, (err) => {
        if (err) return {success: false, error: err};
        sendCodeViaMail(code, email);
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
    Activist.findOne({'profile.email': email, 'login.loginCode': code}, (err, user) => {
        if (err) return {success: false, error: err};
        if(!user)
        {
            return Activist.findOneAndUpdate(
                {'profile.email': email},
                {
                    $inc: {'login.failedLoginCount': 1},
                    'login.lastLoginAttempt': now,
                },
                (err) => {
                    if (err) return {success: false, error: err};
                    return {"error": "incorrect credentials"};
                }
            );
        }
        if(user.login.locked){
            return Activist.findOneAndUpdate(
                {'profile.email': email},
                {
                    'login.lastLoginAttempt': now,
                },
                () => {
                    return {"error": "you've been locked out of the system, please contact an organizer"};
                }
            );
        }
        if(user.login.failedLoginCount > MAX_FAILED_LOGINS){
            return Activist.findOneAndUpdate(
                {'profile.email': email},
                {
                    'login.lastLoginAttempt': now,
                },
                () => {
                    return {"error": "you've been locked out of the system due to too many failed login attempts, please contact an organizer"};
                }
            );
        }
        Activist.findOneAndUpdate(
            {'profile.email': email},
            {
                'login.lastLoginAttempt': now,
                'login.failedLoginCount': 0
            },
            (err) => {
                if (err) return {success: false, error: err};
                assignToken(user._id).then((token) => {
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
    const lockToken = generateLockToken();
    const query = Activist.updateOne(
        {'_id': userId},
        {
            $push: {'login.tokens': {"token": token, "issuedAt": now, "lastUsage": now}},
            lockToken: lockToken
        }
    );
    return query.exec().then(()=>{
        return token
    });
};

const sendCodeViaMail = function(code, email)
{
    const htmlBody = `
    <div dir="rtl" style="text-align: right;">
        <h3 style="color: #60076e">קוד הכניסה שלך למערכת של "עומדים ביחד": ${code}</h3>
        <p>הקוד הזה נשלח כחלק מניסיון התחברות למערכת באמצעות כתובת המייל הזאת.</p>
        <p>אם לא ניסית להיכנס למערכת, <a href="https://www.google.com">נא ללחוץ כאן</a>.</p>
        <p>אחרי שמונה דקות של חוסר פעילות במערכת, תוקף הקוד יפוג, ותצטרכו להתחבר אליה מחדש.</p>
        <p>אם נכנסת למערכת ממחשב ציבורי, חשוב להתנתק בסוף העבודה הן מהמערכת עצמה, והן מחשבון המייל, שגישה אליו מאפשרת כניסה למערכת.</p>
    </div>
    `;
    const textBody = (
        "קוד הכניסה שלך למערכת של \"עומדים ביחד\": " + code + "\n" +
        "הקוד הזה נשלח כחלק מניסיון התחברות למערכת באמצעות כתובת המייל הזאת." + "\n" +
        "אם לא ניסית להיכנס למערכת, נא ללחוץ כאן:" + "\n" +
        "אחרי שמונה דקות של חוסר פעילות במערכת, תוקף הקוד יפוג, ותצטרכו להתחבר אליה מחדש." + "\n" +
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

