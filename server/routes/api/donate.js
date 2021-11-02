const israelGivesSearch = require('../../services/israelGivesSearch');
module.exports = (app) => {
    app.get('/api/donation:email', (req, res) => {
        israelGivesSearch.searchDonationByEmail(req.params.email).then(donation=>{
            const development = process.env.NODE_ENV === 'development';
            if(!donation && !development) {
                return {"err": "donation not found", "donation": false};
            }
            return res.json(donation);
        });
    });
};