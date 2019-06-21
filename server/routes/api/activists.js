const activistFetcher = require('../../services/activistsFetcher');
const activistUpdater = require('../../services/activistUpdater');
const Authentication = require('../../services/authentication');
const dailySummary = require('../../services/dailySummary');

module.exports = (app) => {
	app.get('/api/activists', (req, res) => {
		activistFetcher.getActivists(req, res);
	});
	app.post('/api/selectActivists', (req, res) => {
		activistFetcher.queryActivists(req, res);
	});
	app.get('/api/activists/:id', (req, res) => {
		Authentication.hasRole(req, res, "isOrganizer").then(isUser=>{
			if(!isUser)
				return res.json({"error":"missing token"});
			activistFetcher.getActivistsByIds([req.params.id]).then((activists)=>{
				return res.json(activists[0]);
			});
		})
	});
	app.post('/api/activists', (req, res) => {
		Authentication.hasRole(req, res, "isOrganizer").then(isUser=>{
			if(!isUser)
				return res.json({"error":"missing token"});
			activistUpdater.updateActivists(req.body.activists).then(() => {
				return res.json(true)
			});
		})
	});
	app.post('/api/activists/toggleStatus', (req, res) => {
		activistUpdater.toggleActivistStatus(req, res);
	});
	app.post('/api/activists/uploadTyped', (req, res) => {
		activistUpdater.uploadTypedActivists(req, res);
	});
};

//TODO neta
function queryToMongo(query){
	console.log('query', query)
	let toSend = `{$and:[`;
	(query.conditions||[]).forEach(cond => {
		switch(cond.filterPrefix){
			case 'Is ': toSend += '{'
		}
		switch(cond.filterName){
			case 'Residency': toSend += 'profile.residency:'
		}
		toSend += `"${cond.filterMain}"`;
		switch(cond.filterPrefix){
			case 'Is ': toSend += '}'
		}
		toSend += `]`;
	})
	toSend += `}`;
	console.log('toSend', toSend);
	return {};
}
