const Event = require('../../models/eventModel');
const Authentication = require('../../services/authentication');

module.exports = (app) => {
	app.post('/api/events', (req, res, next) => {
		var newEvent = new Event(req.body.event);
		newEvent.save(function (err) {
			if (err){
				return res.json(err);
			}
			else
				return res.json(req.body);
		});
	});
};
