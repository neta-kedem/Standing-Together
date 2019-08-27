const circleUpdater = require ("../../services/circleUpdater");
const circleFetcher = require('../../services/circleFetcher');
const Authentication = require('../../services/authentication');
module.exports = (app) => {
    app.get('/api/circles', (req, res) => {
        Authentication.isUser(req, res).then(isUser => {
            if (!isUser)
                return res.json({"error": "missing token"});
            circleFetcher.getCircles().then(circles=>{
                return res.json(circles);
            });
        });
    });
    app.post('/api/circles', (req, res) => {
        Authentication.hasRole(req, "isOrganizer").then(isUser => {
            if (!isUser)
                return res.json({"error": "missing token"});
            circleUpdater.saveCircles(req.body.circles).then(circles=>{
                return res.json(circles);
            });
        });
    });
};