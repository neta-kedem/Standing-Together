const cityFetcher = require('../../services/cityFetcher');
const Authentication = require('../../services/authentication');
module.exports = (app) => {
    app.get('/api/cities', (req, res) => {
        Authentication.isUser(req, res).then(isUser => {
            if (!isUser)
                return res.json({"error": "missing token"});
            cityFetcher.getCities().then(cities=>{
                return res.json(cities);
            });
        });
    });
};