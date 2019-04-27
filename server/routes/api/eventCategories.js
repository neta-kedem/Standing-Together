const eventCategoriesUpdater = require('../../services/eventCategoriesUpdater');
const eventCategoryFetcher = require('../../services/eventCategoryFetcher');
const Authentication = require('../../services/authentication');
module.exports = (app) => {
    app.get('/api/eventCategories', (req, res) => {
        Authentication.isUser(req, res).then(isUser => {
            if (!isUser)
                return res.json({"error": "missing token"});
            eventCategoryFetcher.getEvetnCategories().then(categories=>{
                return res.json(categories);
            });
        });
    });
    app.post('/api/eventCategories', (req, res) => {
        Authentication.hasRole(req, res, 'isOrganizer').then(isUser => {
            if (!isUser)
                return res.json({"error": "missing token"});
            eventCategoriesUpdater.saveEventCategories(req.body.eventCategories).then(categories=>{
                return res.json(categories);
            });
        });
    });
};