const membershipUpdater = require('../../services/membershipUpdater');
module.exports = (app) => {
    app.post('/api/membership', (req, res) => {
        membershipUpdater.registerMember(req.body.activistData, req.body.paymentData).then(result=>{
                return res.json(result);
            });
    });
};