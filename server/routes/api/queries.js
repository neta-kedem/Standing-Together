const savedQueryFetcher = require('../../services/savedQueryFetcher');
const savedQueryUpdater = require('../../services/savedQueryUpdater');
const Authentication = require('../../services/authentication');

module.exports = (app) => {
	app.get('/api/queries', (req, res) => {
		Authentication.hasRole(req, "isOrganizer").then(result=>{
			if(result.error)
				return res.json({error: result.error});
			savedQueryFetcher.getSavedQueries().then((queries)=>{
				return res.json(queries);
			})
		})
	});
	app.get('/api/queries/:id', (req, res) => {
		Authentication.hasRole(req, "isOrganizer").then(result=>{
			if(result.error)
				return res.json({error: result.error});
			savedQueryFetcher.getSavedQuery([req.params.id]).then((query)=>{
				return res.json(query);
			});
		})
	});
	app.post('/api/queries', (req, res) => {
		Authentication.hasRole(req, "isOrganizer").then(result=>{
			if(result.error)
				return res.json({error: result.error});
			savedQueryUpdater.saveQuery(req.body.query).then(()=>{
				return res.json(true);
			});
		})
	});
};