const Activist = require('../../models/activistModel');

module.exports = (app) => {
	app.get('/api/activists', (req, res, next) => {
		Activist.find((err, activists) => {
			if (err) return res.json({success: false, error: err});
			activistsList = [];
			for(let activist of activists)
			{
				activistsList.push({
					"phone":activist.profile.phone,
					"email":activist.profile.email,
					"name":activist.profile.firstName+" "+activist.profile.lastName,
					"city":activist.profile.residency,
					"isCaller":activist.role.isCaller,
					"lastEvent":activist.profile.participatedEvents[activist.profile.participatedEvents.length-1]
				});
			}
			return res.json(activistsList);
		});
	});
	app.post('/api/identify/email', (req, res, next) => {
		let email = req.body.email;
	Activist.findOneAndUpdate({'profile.email':email}, {$set : {'login.loginCode':'123456'}}, (err, user) => {
			if (err) return res.json({success: false, error: err});
			return res.json(true);
		});
	});
	app.post('/api/identify/phone', (req, res, next) => {
		let phone = req.body.phone;
		Activist.findOneAndUpdate({'profile.phone':phone}, {$set : {'login.loginCode':'123456'}}, (err, user) => {
			if (err) return res.json({success: false, error: err});
			return res.json(true);
		});
	});
	app.post('/api/login/phone', (req, res, next) => {
		let phone = req.body.phone;
		let code = req.body.code;
		if(!phone)
			return res.json({"error":"missing identification"});
		Activist.findOne({'profile.phone':phone, 'login.loginCode':code}, (err, user) => {
			if (err) return res.json({success: false, error: err});
			if(!user)
			{
				return res.json({"error":"incorrect credentials"});
			}
			let token = generateToken();
			let id = user._id;
			Activist.update({'_id':id},{$push:{'login.token': token}})
			return res.json({"token":token});
		});
	});
	app.post('/api/login/email', (req, res, next) => {
		let email = req.body.email;
		let code = req.body.code;
		if(!email)
			return res.json({"error":"missing identification"});
		Activist.findOne({'profile.email':email, 'login.loginCode':code}, (err, user) => {
			if (err) return res.json({success: false, error: err});
			if(!user)
			{
				return res.json({"error":"incorrect credentials"});
			}
			assignToken(user._id).then((token)=>{
				return res.json({"token":token});
			});
		});
	});
	function assignToken(userid) {
		let token = generateToken();
		let id = userid;
		let query = Activist.update({'_id':id},{$push:{'login.token': token}});
		return query.exec().then(()=>{return token});
	}
	function generateToken() {
	let tokenLength = 32;
    let token = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < tokenLength; i++) {
        token += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return token;
}
};
