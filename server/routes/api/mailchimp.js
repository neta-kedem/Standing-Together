const mailchimpListFetcher = require('../../services/mailchimpListFetcher');
const Authentication = require('../../services/authentication');
module.exports = (app) => {
    app.get('/api/mailchimp/lists/', (req, res) => {
        Authentication.hasRole(req, "isOrganizer").then(isUser => {
            if (!isUser)
                return res.json({"error": "missing token"});
            mailchimpListFetcher.fetchLists(req, res);
        });
    });
};