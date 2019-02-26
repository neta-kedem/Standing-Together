const callManager = require('../../services/callManager');

module.exports = (app) => {
	app.get('/api/call/fetchActivistsToCall/:eventId', (req, res) => {
		callManager.fetchActivistsToCall(req, res)
	});
	app.post('/api/call/pingCalls', (req, res) => {
		callManager.pingCalls(req, res)
	});
	app.post('/api/call/resolveCall', (req, res) => {
		callManager.resolveCall(req, res)
	});
	app.post('/api/call/postponeCall', (req, res) => {
		callManager.postponeCall(req, res)
	});
	app.post('/api/call/markUnanswered', (req, res) => {
		callManager.markUnanswered(req, res)
	});
};
