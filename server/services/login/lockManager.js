const mongoose = require ("mongoose");
const Activist = require('../../models/activistModel');
const settingsManager = require("../settingsManager");
const Mailer = require('../mailer');

const lockUser = async function (userId){
    return Activist.findOneAndUpdate(
        {
            _id: mongoose.Types.ObjectId(userId)
        },
        {
            $set:
                {
                    'login.locked': true,
                    'login.tokens': []
                }
        },
    ).exec().then(() => {
        return true;
    });
};

const unlockUser = async function (userId){
    return Activist.findOneAndUpdate(
        {
            _id: mongoose.Types.ObjectId(userId)
        },
        {
            $set:
                {
                    'login.locked': false,
                    'login.failedLoginCount': 0,
                    'login.tokens': []
                }
        },
    ).exec().then(() => {
        return true;
    });
};

const lockByToken = async function (token){
    if(!token || !token.length)
        return false;
    return Activist.findOneAndUpdate({'login.lockToken': token}, {$set : {'login.locked': true}}).exec().then((err, user) => {
        if (err) return {success: false, error: err};
        sendLockedByUserEmail(user);
        return true;
    });
};

const sendLockedByUserEmail = function(user)
{
    const emailBody = "שימו לב - נעשה ניסיון כניסה למערכת באמצעות המשתמש של " +
        user.profile.firstName + " " + user.profile.lastName +
        ", אבל לאחר קבלת המייל עם קוד המערכת הם סימנו שלא עשו ניסיון להיכנס למערכת." +
        " ייתכן שמדובר בניסיון פריצה למערכת - צרו קשר עם המשתמש בהקדם."
    ;
    settingsManager.getSettingByName("securityAlertRecipients").then(emailTo => {
        Mailer.sendEmail({
            from: 'info@standing-together.org',
            to: emailTo.join(", "),
            subject: '*** Standing Together - Security Alert ***',
            text: emailBody,
            html: emailBody
        });

    });
};

module.exports = {
    lockUser,
    unlockUser,
    lockByToken,
};

