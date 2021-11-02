const membershipUpdater = require('../../services/membershipUpdater');
const Authentication = require('../../services/authentication');

module.exports = (app) => {
    app.post('/api/membership', (req, res) => {
        membershipUpdater.registerMember(req.body.activistData, req.body.paymentData).then(result=>{
                return res.json(result);
            });

    });

    app.post('/api/membership/:id', (req, res) => {
        Authentication.hasRole(req, "isOrganizer").then(() => {
            membershipUpdater.updateMembership(req.params.id).then(result => {
                return res.json(result);
            });
        });
    })
};