const upload = require('../../services/contactScanUploader');

module.exports = (app) => {
	app.post('/api/contactScan/upload', upload.upload.single('scan'), (req, res) => {
		res.json({"success":true, "url": req.file.filename});
	});
};

