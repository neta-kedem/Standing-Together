const Activist = require('../models/activistModel');
const Mailer = require('../services/mailer');

const MAX_FAILED_LOGINS = 3;

const identifyViaPhone = function (req, res){
    let phone = req.body.phone;
    phone = phone.replace(/[\-.():]/g, '');
    let code = Math.random().toString(36).substr(2, 6);
    Activist.findOneAndUpdate({'profile.phone':phone}, {$set : {'login.loginCode':code}}, (err, user) => {
        if (err) return res.json({success: false, error: err});
        return res.json(true);
    });
};
const identifyViaEmail = function (req, res){
    let email = req.body.email;
    let code = Math.random().toString(36).substr(2, 6);
    Activist.findOneAndUpdate({'profile.email':email}, {$set : {'login.loginCode':code}}, (err, user) => {
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
    let email = req.body.email;
    let code = req.body.code;
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
                    if (err) return res.json({success: false, error: err});
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
                return res.json({"error":"you've been locked out of the system due to too many failed login attempts, please contact an organizer"});
            });
        assignToken(user._id).then((token)=>{
            return res.json({"token":token, "permissions":user.role});
        });
    });
};

const sendCodeViaMail = function(code, email)
{
    Mailer.sendEmail({
        from: 'noreply@gmail.com',
        to: email,
        subject: 'Your login code for Standing Together',
        text: 'Use the following code: ' + code
    });
};
const assignToken = function(userId) {
    const now = new Date();
    let token = generateToken();
    let query = Activist.update({'_id':userId},{$push:{'login.token': {token: token, issuedAt: now, lastUsage: now}}});
    return query.exec().then(()=>{return token});
};
const generateToken = function() {
    let tokenLength = 32;
    let token = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(let i = 0; i < tokenLength; i++) {
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

