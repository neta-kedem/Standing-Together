const activistFetcher = require('../../services/activistsFetcher');
const activistUpdater = require('../../services/activistUpdater');
const Authentication = require('../../services/authentication');
const excelExport = require('../../services/excelExport');

module.exports = (app) => {
	app.post('/api/selectActivists', (req, res) => {
		Authentication.hasRole(req, "isOrganizer").then(result=>{
			if(result.error)
				return res.json({error: result.error});
			return activistFetcher.queryActivists(req.body.query, req.body.sortBy, req.body.page, (result)=>{return res.json(result)})
		})
	});
	app.post('/api/queryToXLSX', (req, res) => {
		Authentication.hasRole(req, "isOrganizer").then(result=>{
			if(result.error)
				return res.json({error: result.error});
			res.setHeader('Content-Type', 'text/csv');
			res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
			activistFetcher.downloadActivistsByQuery(req.body.query, req.body.sortBy, (result) => {
				return res.json({"csv":excelExport.getCSV(result.activists, ["firstName", "lastName", "city", "phone", "email",  "isCaller", "creationDate", "circle", "isMember", "isPaying", "isNewsletter", "memberSince", "tz", "street", "houseNum", "apartmentNum", "mailbox", "birthday"])});
			});
		})
	});
	app.get('/api/activists/:id', (req, res) => {
		Authentication.hasRole(req, "isOrganizer").then(result=>{
			if(result.error)
				return res.json({error: result.error});
			activistFetcher.getActivistsByIds([req.params.id]).then((activists)=>{
				return (activists && activists.length) ? res.json(activists[0]) : res.json({error: "not found"});
			});
		})
	});
	//my code
	app.post('/api/activists/events/', (req, res) => {
		console.log("hello12")
		Authentication.hasRole(req, "isOrganizer").then(result=>{
			if(result.error)
				return res.json({error: result.error});
			const query = `{\"linked.participatedEvents\":{\"$elemMatch\":{\"_id\":{\"$eq\":\"${req.body.id}\",\"castToId\":true}}}}`
			return activistFetcher.queryActivists(query, null, req.body.page, (result)=>{return res.json(result)})
			// const test =  activistFetcher.getActivistsByEvent(req.params.id)
			// console.log(test)
			// return test
			// 	.then((activists)=>{
			// 	return (activists) ? res.json(activists) : res.json({error: "not found"});
			// })
		})
	})
	app.post('/api/activists', (req, res) => {
		Authentication.hasRole(req, "isOrganizer").then(result=>{
			if(result.error)
				return res.json({error: result.error});
			activistUpdater.updateActivists(req.body.activists).then(() => {
				return res.json(true)
			});
		})
	});
	app.post('/api/activists/uploadTyped', (req, res) => {
		Authentication.hasRole(req, ["isTyper", "isOrganizer"]).then(result => {
			if (result.error)
				return res.json({"error": result.error});
			activistUpdater.uploadTypedActivists(req.body.activists, req.body.scanId, req.body.markedDone).then((result)=>{
				return res.json(result);
			});
		});
	});
};

