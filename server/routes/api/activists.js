const activistFetcher = require('../../services/activistsFetcher');
const activistUpdater = require('../../services/activistUpdater');

const dailySummary = require('../../services/dailySummary');

module.exports = (app) => {
	app.get('/api/activists', (req, res) => {
		activistFetcher.getActivists(req, res);
	});
	app.post('/api/selectActivists', (req, res) => {
		dailySummary.sendDailySummary().then((result)=>{
			console.log(result)
		});
		activistFetcher.queryActivists(req, res);
	});
	app.post('/api/activists', (req, res) => {
		activistUpdater.insertActivists(req, res);
	});
	app.post('/api/activists/toggleStatus', (req, res) => {
		activistUpdater.toggleActivistStatus(req, res);
	});
	app.post('/api/activists/uploadTyped', (req, res) => {
		activistUpdater.uploadTypedActivists(req, res);
	});
};