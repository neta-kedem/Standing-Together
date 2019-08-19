const Activist = require('../models/activistModel');
const Mailer = require('../services/mailer');

const MAX_FAILED_LOGINS = 3;
const LOGIN_CODE_LENGTH = 12;
const TOKEN_LENGTH = 32;

const identifyViaPhone = function (req, res){
    let phone = req.body.phone;
    phone = phone.replace(/[\-.():]/g, '');
    let code = Math.random().toString(36).substr(2, LOGIN_CODE_LENGTH);
    Activist.findOneAndUpdate({'profile.phone':phone}, {$set : {'login.loginCode':code}}, (err, user) => {
        if (err) return res.json({success: false, error: err});
        return res.json(true);
    });
};
const identifyViaEmail = function (req, res){
    let email = req.body.email.toLowerCase();
    let code = Math.random().toString(36).substr(2, LOGIN_CODE_LENGTH);
    Activist.findOneAndUpdate({'profile.email':email}, {$set : {'login.loginCode': code}}, (err, user) => {
        if (err) return res.json({success: false, error: err});
        sendCodeViaMail(code, email);
        return res.json(true);
    });
};
const loginViaPhone = function (req, res){
    let phone = req.body.phone;
    phone = phone.replace(/[\-.():]/g, '');
    let code = req.body.code;
    if(!code||code.length===0)
        return res.json({"error":"incorrect credentials"});
    if(!phone)
        return res.json({"error":"missing identification"});
    Activist.findOne({'profile.phone':phone, 'login.loginCode':code}, (err, user) => {
        if (err) return res.json({success: false, error: err});
        if(!user)
        {
            return res.json({"error":"incorrect credentials"});
        }
        assignToken(user._id).then((token)=>{
            return res.json({"token":token, "permissions":user.role});
        });
    });
};
const loginViaMail = function (req, res){
    let email = req.body.email.toLowerCase();
    let code = req.body.code.toLowerCase();
    const now = new Date();
    if(!code||code.length===0)
        return res.json({"error":"incorrect credentials"});
    if(!email)
        return res.json({"error":"missing identification"});
    Activist.findOne({'profile.email':email, 'login.loginCode':code}, (err, user) => {
        if (err) return res.json({success: false, error: err});
        if(!user)
        {
            return Activist.findOneAndUpdate({'profile.email':email},
                {
                    $inc: {'login.failedLoginCount': 1},
                    'login.lastLoginAttempt': now,
                },
                (err) => {
                if (err) return res.json({success: false, error: err});
                return res.json({"error":"incorrect credentials"});
            });
        }
        if(user.login.failedLoginCount > MAX_FAILED_LOGINS){
            return Activist.findOneAndUpdate({'profile.email':email},
                {
                    'login.lastLoginAttempt': now,
                },
                (err) => {
                    return res.json({"error":"you've been locked out of the system due to too many failed login attempts, please contact an organizer"});
                });
        }
        Activist.findOneAndUpdate({'profile.email':email},
            {
                'login.lastLoginAttempt': now,
                'login.failedLoginCount': 0
            },
            (err) => {
                if (err) return res.json({success: false, error: err});
                assignToken(user._id).then((token)=>{
                    return res.json({"token":token, "permissions":user.role});
                });
            });
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
const assignToken = function(userId) {
    const now = new Date();
    let token = generateToken();
    let query = Activist.updateOne({'_id': userId}, {$push:{'login.tokens': {"token": token, "issuedAt": now, "lastUsage": now}}});
    return query.exec().then(()=>{
        return token
    });
};
const generateToken = function() {
    let token = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(let i = 0; i < TOKEN_LENGTH; i++) {
        token += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return token;
};

module.exports = {
    identifyViaPhone,
    identifyViaEmail,
    loginViaPhone,
    loginViaMail
};

