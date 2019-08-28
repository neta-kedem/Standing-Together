const circleUpdater = require ("../../services/circleUpdater");
const circleFetcher = require('../../services/circleFetcher');
const Authentication = require('../../services/authentication');
module.exports = (app) => {
    app.get('/api/circles', (req, res) => {
        Authentication.hasRole(req, ["isOrganizer", "isTyper"]).then(result => {
            if (result.error)
                return res.json({"error": result.error});
            circleFetcher.getCircles().then(circles=>{
                return res.json(circles);
            });
        });
    });
    app.post('/api/circles', (req, res) => {
        Authentication.hasRole(req, "isOrganizer").then(result => {
            if (result.error)
                return res.json({"error": result.error});
            circleUpdater.saveCircles(req.body.circles).then(circles=>{
                return res.json(circles);
            });
        });
    });
};