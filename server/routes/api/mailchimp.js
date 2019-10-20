const mailchimpListFetcher = require('../../services/mailchimpListFetcher');
const mailchimpMemberFetcher = require('../../services/mailchimpMemberFetcher');
const mailchimpSync = require('../../services/mailchimpSync');
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
    app.post('/api/mailchimp/enroll/', (req, res) => {
        Authentication.hasRole(req, "isOrganizer").then(result => {
            if (result.error)
                return res.json({"error": result.error});
            mailchimpSync.createContacts([req.body.activist], req.body.listId).then(result => {
                return res.json(result);
            });
        });
    });
    app.post('/api/mailchimp/unenroll/', (req, res) => {
        Authentication.hasRole(req, "isOrganizer").then(result => {
            if (result.error)
                return res.json({"error": result.error});
            mailchimpSync.deleteContacts([req.body.activist], req.body.listId).then(result => {
                return res.json(result);
            });
        });
    });
};