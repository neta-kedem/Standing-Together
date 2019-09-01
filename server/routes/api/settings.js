const settingsManager = require('../../services/settingsManager');
const Authentication = require('../../services/authentication');
module.exports = (app) => {
    app.get('/api/settings', (req, res) => {
        Authentication.hasRole(req, 'isOrganizer').then(result => {
            if (result.error)
                return res.json({"error": result.error});
            settingsManager.getSettings().then(settings=>{
                return res.json(settings);
            });
        });
    });
    app.post('/api/settings', (req, res) => {
        Authentication.hasRole(req, 'isOrganizer').then(result => {
            if (result.error)
                return res.json({"error": result.error});
            settingsManager.setSettings(req.body.settings).then(()=>{
                return res.json(true);
            });
        });
    });
};