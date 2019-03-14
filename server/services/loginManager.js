const Activist = require('../models/activistModel');
const Mailer = require('../services/mailer');

const identifyViaPhone = function (req, res){
    let phone = req.body.phone;
    phone = phone.replace(/[\-.():]/g, '');
    Activist.findOneAndUpdate({'profile.phone':phone}, {$set : {'login.loginCode':'123456'}}, (err, user) => {
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
    if(!code||code.length===0)
        return res.json({"error":"incorrect credentials"});
    if(!email)
        return res.json({"error":"missing identification"});
    Activist.findOne({'profile.email':email, 'login.loginCode':code}, (err, user) => {
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

const sendCodeViaMail = function(code, email)
{
    Mailer.sendEmail({
        from: 'yanivcogan89@gmail.com',
        to: email,
        subject: 'Your login code for Standing Together',
        text: 'Use the following code: '+code
    });
};
const assignToken = function(userid) {
    let token = generateToken();
    let query = Activist.update({'_id':userid},{$push:{'login.token': token}});
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

