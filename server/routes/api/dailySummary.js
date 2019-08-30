const dailySummary = require('../../services/dailySummary');
const Authentication = require('../../services/authentication');

module.exports = (app) => {
    app.get('/api/dailySummary', (req, res) => {
        Authentication.hasRole(req, "isOrganizer").then(result => {
            if (result.error)
                return res.json({"error": result.error});
            dailySummary.getDailySummary().then(summary => {
                return res.json(summary);
            });
        });
    });
};
