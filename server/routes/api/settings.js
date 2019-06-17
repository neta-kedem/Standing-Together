const settingsManager = require('../../services/settingsManager');
const Authentication = require('../../services/authentication');
module.exports = (app) => {
    app.get('/api/settings', (req, res) => {
        Authentication.hasRole(req, res, 'isOrganizer').then(isUser => {
            if (!isUser)
                return res.json({"error": "missing token"});
            settingsManager.getSettings().then(settings=>{
                return res.json(settings);
            });
        });
    });
    app.post('/api/settings', (req, res) => {
        Authentication.hasRole(req, res, 'isOrganizer').then(isUser => {
            if (!isUser)
                return res.json({"error": "missing token"});
            settingsManager.setSettings(req.body.settings).then(()=>{
                return res.json(true);
            });
        });
    });
};