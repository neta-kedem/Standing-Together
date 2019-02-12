const ContactScanUpdater = require('../../services/contactScanUpdater');
const ContactScanFetcher = require('../../services/contactScanFetcher');

module.exports = (app) => {
	app.get('/api/contactScan', (req, res) => {
		ContactScanFetcher.getContactScan(req, res);
	});
	app.post('/api/contactScan', (req, res) => {
		ContactScanUpdater.insertContactScan(req, res);
	});
	app.post('/api/contactScan/pingScan', (req, res) => {
		ContactScanUpdater.pingScan(req, res);
	});
};
