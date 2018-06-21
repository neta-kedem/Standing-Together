const Event = require('../../models/eventModel');
const Activist = require('../../models/activistModel');

const Authentication = require('../../services/authentication');

module.exports = (app) => {
	app.post('/api/events', (req, res, next) => {
		Authentication.isUser(req, res).then(isUser=>{
			if(!isUser)
				return res.json({"error":"missing token"});
			var eventObject = req.body.event;
			var today = new Date();
			eventObject.metadata={
				"creationDate": today,
				"lastUpdate": today,
				"creatorId": Authentication.getMyId()
			}
			var schedule = eventObject.eventDetails.date.split("/")
			eventObject.eventDetails.date = new Date(schedule[2], schedule[1] - 1, schedule[0])
			var newEvent = new Event(eventObject);
			newEvent.save(function (err) {
				if (err){
					return res.json(err);
				}
				else
					return res.json(req.body);
			});
		})
	});
	app.get('/api/events', (req, res, next) => {
		Authentication.isUser(req, res).then(isUser=>{
			if(!isUser)
				return res.json({"error":"missing token"});
			Event.find((err, events) => {
				if (err) return res.json({success: false, error: err});
				eventList = [];
				for(let e of events)
				{
					eventList.push({
						"_id":e._id,
						"name":e.eventDetails.name,
						"date":e.eventDetails.date
					});
				}
				return res.json(eventList);
			});
		})
	});
	app.post('/api/events/inviteByQuery', (req, res, next) => {
		Authentication.isUser(req, res).then(isUser=>{
			if(!isUser)
				return res.json({"error":"missing token"});
			const query = req.body.query;
			const eventId = req.body.eventId;
			Activist.find(query, (err, activists) => {
				//extract the _id field from the results, into an non-associative array
				let invitedIds = activists.map(function(value,index) {return value["_id"];});
				let invitations = [];
				for (var i =0; i<invitedIds.length; i++)
				{
					invitations.push({
						"activistId": invitedIds[i],
						"lastCallAt": null,
						"availableAt": null,
						"isHandled": false,
						"callerId": null
					});
				}
				//date of campaign creation
				let today = new Date();
				let campaignObject = {
					"metadata":{
						"creationDate": today,
						"lastUpdate": today,
						"creatorId": Authentication.getMyId()
					},
					"selectionQuery": JSON.stringify(query),
					"eventCode": "ASDFGHJKL",
					"invitations": invitations
				}
				Event.findOneAndUpdate({'_id':eventId}, {$set : {'campaign':campaignObject}}, (err, user) => {
					if (err) return res.json({success: false, error: err});
						return res.json(true);
				});
			});
		})
	});
	app.post('/api/events/eventByCode', (req, res, next) => {
		Authentication.isUser(req, res).then(isUser=>{
			if(!isUser)
				return res.json({"error":"missing token"});
			var eventCode = req.body.eventCode;
			Event.findOne({"campaign.eventCode": eventCode}, (err, eventData) => {
				if (err) return res.json({success: false, error: err});
				if (!eventData)
					return res.json({"error":"couldn't find a matching event"});
				return res.json({
					"eventDetails":eventData.eventDetails,
					"callInstructions":eventData.callInstructions
				});
			});
		})
	});
};
