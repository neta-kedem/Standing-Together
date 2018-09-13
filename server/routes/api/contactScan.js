const contactScan = require('../../models/contactScanModel');
const Authentication = require('../../services/authentication');
//constants
//how much time (in minutes) after the last ping should an scanned sheet be reserved for the typer assigned to it.
const maxReservationDuration = 3;
module.exports = (app) => {
	app.post('/api/contactScan', (req, res, next) => {
		Authentication.hasRole(req, res, "isOrganizer").then(isUser=>{
			if(!isUser)
				return res.json({"error":"missing token"});
			const scanUrl = req.body.scanUrl;
			//the cells info as received from the client (i.e. [[{x,y},{x,y},{x,y},{x,y}]...]
			const cells = req.body.cells;
			//constructing the cells info as required by the schema (i.e. [{corners:[{x,y},{x,y},{x,y},{x,y}]}...]
			let cellsObject = []
			for (let i=0; i<cells.length; i++)
			{
				cellsObject[i]={"cells":[]};
				for(let j=0; j<cells[i].length; j++)
				{
					cellsObject[i].cells.push({"corners":cells[i][j]});
				}
			}
			const today = new Date();
			scanObject={
				"metadata":{
					"creationDate": today,
					"lastUpdate": today,
					"creatorId": Authentication.getMyId()
				},
				"scanUrl":scanUrl,
				"rows":cellsObject
			}
			const newScan = new contactScan(scanObject);
			newScan.save(function (err) {
				if (err){
					return res.json(err);
				}
				else
					return res.json(req.body);
			});
		})
	});
	app.get('/api/contactScan', (req, res, next) => {
		Authentication.hasRole(req, res, "isTyper").then(isUser=>{
			if(!isUser)
				return res.json({"error":"missing token"});
			const typerId = Authentication.getMyId();
			const now = new Date();
			const reservationDeadline = new Date(now.getTime()+maxReservationDuration*60000);
			contactScan.findOneAndUpdate(
				{"complete": false, $or:[{"lastPing":null}, {"lastPing":{$lt: reservationDeadline}}]},
				{"$set": {"lastPing": now, "typerId": typerId}},
				(err, eventData) => {
				if (err) return res.json({success: false, error: err});
				if (!eventData)
					return res.json({"error":"no pending scans are available"});
				return res.json(eventData);
			});
		})
	});
};
