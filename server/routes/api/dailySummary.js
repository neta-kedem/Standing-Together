const dailySummary = require('../../services/dailySummary');
const Authentication = require('../../services/authentication');

module.exports = (app) => {
    app.get('/api/dailySummary', (req, res) => {
        Authentication.hasRole(req, "isOrganizer").then(isUser => {
            if (!isUser)
                return res.json({"error": "missing token"});
            dailySummary.getDailySummary().then(summary => {
                return res.json(summary);
            });
        });
    });
};
