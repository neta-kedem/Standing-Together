const loginManager = require('../../services/loginManager')

module.exports = (app) => {
	app.post('/api/identify/phone', (req, res) => {
		loginManager.identifyViaPhone(req, res);
	});
	app.post('/api/identify/email', (req, res) => {
		loginManager.identifyViaEmail(req, res);
	});
	app.post('/api/login/phone', (req, res) => {
		loginManager.loginViaPhone(req, res);
	});
	app.post('/api/login/email', (req, res) => {
		loginManager.loginViaMail(req, res);
	});
};