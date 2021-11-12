const voteManager = require('../../services/voteManager');

module.exports = (app) => {
	app.get('/api/candidates/fetchCandidates', (req, res) => {
		voteManager.fetchAllCandidates(req, res)
	});
	app.post('/api/candidates/placeVote', (req, res) => {
		voteManager.placeVote(req, res)
	});
	app.post('/api/candidates/validateCode', (req, res) => {
		voteManager.validateCode(req, res)
	});
	app.get('/api/votes/fetchAllVotes', (req, res) => {
		voteManager.fetchAllVotes(req, res)
	});
};
