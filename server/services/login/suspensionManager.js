const Activist = require('../../models/activistModel');
const Mailer = require('../mailer');

const TOKEN_LENGTH = 12;

const sendUnsuspendEmail = async function(token) {
    const code = generateUnsuspendCode();
    const user = await Activist.findOne({'login.tokens.token': token}).exec();
    for(let i = 0; i < user.login.tokens.length; i++){
        if(user.login.tokens[i].token === token){
            user.login.tokens[i].unlockToken = code;
        }
    }
    const query = Activist.updateOne({'_id': user._id}, {"login.tokens": user.login.tokens});
    return query.exec().then(()=>{
        sendCodeViaMail(code, user.profile.email);
        return true;
    });
};

//this token is used to login into the system
const generateUnsuspendCode = function() {
    let token = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(let i = 0; i < TOKEN_LENGTH; i++) {
        token += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return token;
};

const sendCodeViaMail = function(code, email)
{
    const htmlBody = `
    <div dir="rtl" style="text-align: right;">
        <h3>על מנת להמשיך לעבוד במערכת, הזינו את הקוד: ${code}</h3>
    </div>
    `;
    const textBody = (
        "על מנת להמשיך לעבוד במערכת, הזינו את הקוד: " + code + "\n"
    );
    Mailer.sendEmail({
        from: 'info@standing-together.org',
        to: email,
        subject: 'Unsuspend Your Standing Together Session',
        text: textBody,
        html: htmlBody
    });
};

const unsuspend = async function(token, code) {
    if(!code)
        return {error: "missing code"};
    const now = new Date();
    const user = await Activist.findOne({'login.tokens.token': token}).exec();
    for(let i = 0; i < user.login.tokens.length; i++){
        if(user.login.tokens[i].token === token &&  user.login.tokens[i].unlockToken === code){
            user.login.tokens[i].lastUsage = now;
        }
    }
    const query = Activist.updateOne({'_id': user._id}, {"login.tokens": user.login.tokens});
    return query.exec().then(()=>{
        return true;
    });
};

module.exports = {
    sendUnsuspendEmail,
    unsuspend
};

