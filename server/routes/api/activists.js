const activistFetcher = require('../../services/activistsFetcher');
const activistUpdater = require('../../services/activistUpdater');
const Authentication = require('../../services/authentication');
const excelExport = require('../../services/excelExport');

module.exports = (app) => {
	app.get('/api/activists', (req, res) => {
		activistFetcher.getActivists(req, res);
	});
	app.post('/api/selectActivists', (req, res) => {
		Authentication.hasRole(req, res, "isOrganizer").then(isUser=>{
			if(!isUser)
				return res.json({"error":"missing token"});
			return activistFetcher.queryActivists(req.body.query, req.body.page, (result)=>{return res.json(result)})
		})
	});
	app.post('/api/queryToXLSX', (req, res) => {
		Authentication.hasRole(req, res, "isOrganizer").then(isUser=>{
			if(!isUser)
				return res.json({"error":"missing token"});
			res.setHeader('Content-Type', 'text/csv');
			res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
			activistFetcher.downloadActivistsByQuery(req.body.query, (result) => {
				return res.json({"csv":excelExport.getCSV(result.activists, ["firstName", "lastName", "city", "phone", "email"])});
			});
		})
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
	app.post('/api/activists/uploadTyped', (req, res) => {
		Authentication.hasRole(req, res, "isTyper").then(isUser=> {
			if (!isUser)
				return res.json({"error": "missing token"});
			activistUpdater.uploadTypedActivists(req.body.activists, req.body.scanId, req.body.markedDone).then((result)=>{
				return res.json(result);
			});
		});
	});
};

//TODO neta- what did I try to do here?
/*function queryToMongo(query){
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
}*/
