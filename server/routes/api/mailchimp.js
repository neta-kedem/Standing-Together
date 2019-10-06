const mailchimpListFetcher = require('../../services/mailchimpListFetcher');
const mailchimpMemberFetcher = require('../../services/mailchimpMemberFetcher');
const Authentication = require('../../services/authentication');
module.exports = (app) => {
    app.get('/api/mailchimp/lists/', (req, res) => {
        Authentication.hasRole(req, "isOrganizer").then(result => {
            if (result.error)
                return res.json({"error": result.error});
            mailchimpListFetcher.fetchLists(req, res);
        });
    });
    app.get('/api/mailchimp/search/', (req, res) => {
        Authentication.hasRole(req, "isOrganizer").then(result => {
            if (result.error)
                return res.json({"error": result.error});
            mailchimpMemberFetcher.searchMember(req.query.email).then(result => {
                return res.json(result);
            });
        });
    });
};