const ContactScanUpdater = require('../../services/contactScanUpdater');
const ContactScanFetcher = require('../../services/contactScanFetcher');
const Authentication = require('../../services/authentication');

module.exports = (app) => {
	app.get('/api/contactScan', (req, res) => {
		ContactScanFetcher.getContactScan(req, res);
	});
	app.post('/api/contactScan', (req, res) => {
		Authentication.hasRole(req, ["isOrganizer", "isTyper"]).then(result => {
			if (result.error)
				return res.json({"error": result.error});
			ContactScanUpdater.insertContactScan(req.body.scanUrl, req.body.eventId).then((result) => {
				res.json(result);
			});
		});
	});
	app.post('/api/contactScan/pingScan', (req, res) => {
		Authentication.hasRole(req, ["isTyper", "isOrganizer"]).then(result => {
			if (result.error)
				return res.json({"error": result.error});
			ContactScanUpdater.pingScan(req.body.scanId).then((result) => {
				res.json(result);
			});
		});
	});
	app.post('/api/contactScan/importActivists', (req, res) => {
		Authentication.hasRole(req, ["isTyper", "isOrganizer"]).then(result => {
			if (result.error)
				return res.json({"error": result.error});
			ContactScanUpdater.importContacts(req.body.eventId, req.body.activists).then((result)=>{
				return res.json(result);
			});
		});
	});
};
