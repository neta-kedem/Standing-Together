const cityUpdater = require('../../services/cityUpdater');
const cityFetcher = require('../../services/cityFetcher');
const SQLSync = require('../../services/SQLSync');
const Authentication = require('../../services/authentication');
module.exports = (app) => {
    app.get('/api/cities', (req, res) => {
         cityFetcher.getCities().then(cities=>{
             return res.json(cities);
         });
    });
    app.post('/api/cities', (req, res) => {
        Authentication.hasRole(req, "isOrganizer").then(result => {
            if (result.error)
                return res.json({"error": result.error});
            cityUpdater.saveCities(req.body.cities).then(cities=>{
                return res.json(cities);
            });
        });
    });
};