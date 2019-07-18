const ContactScanUpdater = require('../../services/contactScanUpdater');
const ContactScanFetcher = require('../../services/contactScanFetcher');
const Authentication = require('../../services/Authentication');

module.exports = (app) => {
	app.get('/api/contactScan', (req, res) => {
		ContactScanFetcher.getContactScan(req, res);
	});
	app.post('/api/contactScan', (req, res) => {
		Authentication.hasRole(req, res, ["isOrganizer", "isTyper"]).then(isUser=>{
			if (!isUser)
				return res.json({"error": "missing token"});
			ContactScanUpdater.insertContactScan(req.body.scanUrl, req.body.eventId).then((result) => {
				res.json(result);
			});
		});
	});
	app.post('/api/contactScan/pingScan', (req, res) => {
		Authentication.hasRole(req, res, "isTyper").then(isUser=>{
			if (!isUser)
				return res.json({"error": "missing token"});
			ContactScanUpdater.pingScan(req.body.scanId).then((result) => {
				res.json(result);
			});
		});
	});
};
