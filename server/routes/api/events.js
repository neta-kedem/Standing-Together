const eventUpdater = require('../../services/eventUpdater');
const eventFetcher = require('../../services/eventFetcher');

module.exports = (app) => {
	app.post('/api/events', (req, res) => {
		eventUpdater.insertEvent(req, res);
	});
	app.post('/api/events/inviteByQuery', (req, res) => {
		eventUpdater.inviteByQuery(req, res);
	});
	app.get('/api/events/eventByCode', (req, res) => {
		eventFetcher.getEventByCode(req, res);
	});
	app.get('/api/events/getInviteless', (req, res) => {
		eventFetcher.getCampaignLess(req, res);
	});
	app.get('/api/events/list', (req, res) => {
		eventFetcher.listEvents(req, res);
	});
};
