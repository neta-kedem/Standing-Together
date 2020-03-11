const crowdFunder = require('../../services/crowdFunder');
module.exports = (app) => {
    app.get('/api/crowdFund/sum', (req, res) => {
        crowdFunder.getDonatedSum().then(sum=>{
            return res.json({"sum": sum});
        });
    });
    app.post('/api/crowdFund', (req, res) => {
        crowdFunder.makeDonation(req.body.activistData, req.body.amount).then(result=>{
            return res.json(result);
        });
    });
};