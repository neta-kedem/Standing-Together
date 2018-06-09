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
						"_id":activist._id,
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
		var newActivist = new Activist(req.body);
		newActivist.save(function (err) {
			if (err){
				return res.json(err);
			}
			else
				return res.json(req.body);
		});
	});
	app.post('/api/activists/toggleStatus', (req, res, next) => {
		var activistId = req.body.activistId;
		var isCaller = req.body.status;
		let query = Activist.update({'_id':activistId},{'role.isCaller': isCaller});
		return query.exec().then(()=>{
			return res.json({"result":"set status to "+isCaller+" for user "+activistId});
		});
	});
};
