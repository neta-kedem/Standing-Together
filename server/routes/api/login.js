const loginManager = require('../../services/login/loginManager');
const logoutManager = require('../../services/login/logoutManager');
const lockManager = require('../../services/login/lockManager');
const Authentication = require('../../services/authentication');

module.exports = (app) => {
	app.post('/api/identify/email', (req, res) => {
		loginManager.identifyViaEmail(req.body.email).then(result => res.json(result));
	});
	app.post('/api/login/email', (req, res) => {
		loginManager.loginViaMail(req.body.email, req.body.code).then(result => res.json(result));
	});
	app.get('/api/logout', (req, res) => {
		logoutManager.logout(req, res);
	});
	app.get('/api/lock/email', (req, res) => {
		lockManager.lockByToken(req.params.lockToken).then(result => res.json(result));
	});
	app.post('/api/lock/user', (req, res) => {
		Authentication.hasRole(req, "isOrganizer").then(result => {
			if (result.error)
				return res.json({"error": result.error});
			lockManager.lockUser(req.body.userId).then(result => res.json(result));
		});
	});
	app.post('/api/unlock/user', (req, res) => {
		Authentication.hasRole(req, "isOrganizer").then(result => {
			if (result.error)
				return res.json({"error": result.error});
			lockManager.unlockUser(req.body.userId).then(result => res.json(result));
		});
	});
};