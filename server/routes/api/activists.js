const Activist = require('../../models/activistModel');
const Authentication = require('../../services/authentication');

function queryToMongo(query){
	console.log('query', query)
	let toSend = `{$and:[`;
	(query.conditions||[]).forEach(cond => {
		switch(cond.filterPrefix){
			case 'Is ': toSend += '{'
		}
		switch(cond.filterName){
			case 'Residency': toSend += 'profile.residency:'
		}
		toSend += `"${cond.filterMain}"`;
		switch(cond.filterPrefix){
			case 'Is ': toSend += '}'
		}
		toSend += `]`;
	})
	toSend += `}`;
	console.log('toSend', toSend);
	return {};
}


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
	app.post('/api/selectActivists', (req, res, next) => {
		Authentication.isUser(req, res).then(isUser=>{
			if(!isUser)
				return res.json({"error":"missing token"});
			const query = req.body.query;
			Activist.find(queryToMongo(query), (err, activists) => {
				if (err) return res.json({success: false, error: err});
				const activistsList = [];
				console.log('activists.length', activists.length)
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
	app.post('/api/activists/uploadTyped', (req, res, next) => {
		var typedActivists = req.body.activists;
		var processedActivists = [];
		var today = new Date();
		for (var i=0; i<typedActivists.length; i++)
		{
			var curr = typedActivists[i];
			processedActivists.push(
				{
					"metadata" : {
						"creationDate" : today,
						"lastUpdate" : today,
						"joiningMethod" : "contactPage",
						"typerName" : "Yaniv Cogan"
					},
					"profile" : {
						"firstName" : curr.fname,
						"lastName" : curr.lname,
						"phone" : curr.phone.replace(/[\-\.\(\)\:]/g, ''),
						"email" : curr.mail,
						"residency" : curr.settlement,
						"circle" : "תל-אביב",
						"isMember" : false,
						"isPaying" : false,
						"isNewsletter" : false,
						"participatedEvents" : []
					},
					"role" : {
						"isTyper" : false,
						"isCaller" : false,
						"isOrganizer" : false,
						"isCircleLeader" : false
					},
					"login" : {
						"loginCode" : null,
						"token" : []
					}
				}
			);
		}
		Activist.insertMany(processedActivists).then(function (err) {
			if (err){
				return res.json(err);
			}
			else
			{
				return res.json(true);
			}
		});
	});
};
