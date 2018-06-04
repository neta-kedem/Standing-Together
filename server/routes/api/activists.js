const Activist = require('../../models/activistModel');
const Authentication = require('../../services/authentication');

module.exports = (app) => {
	app.get('/api/activists', (req, res, next) => {
		Authentication.isUser(req, res).then(isUser=>{
			if(!isUser)
				return res.json({"error":"missing token"});
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
		})
	});
	app.post('/api/activists', (req, res, next) => {
		var chomsky = new Activist(req.body);
		chomsky.save(function (err) {
			if (err){
				return res.json(err);
			}
			else
				return res.json(req.body);
		});
	});
};
