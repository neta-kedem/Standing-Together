const trackedLinkUpdater = require('../../services/trackedLinkUpdater');
module.exports = (app) => {
    app.post('/api/trackLink', (req, res) => {
        trackedLinkUpdater.track(req.body.url, req.body.data).then(()=>{
            return res.json(true);
        });
    });
};