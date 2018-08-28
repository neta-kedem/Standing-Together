const multer = require('multer');
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/uploads/contactScans/')
	},
	filename: function (req, file, cb) {
		console.log('file', file);
		const ext = file.originalname.substr(file.originalname.lastIndexOf('.'));
		cb(null, file.fieldname + '-' + Date.now() + (ext.length>2?ext:".jpg"));
	}
});
const upload = multer({ storage: storage });
// It's very crucial that the file name matches the name attribute in your html

module.exports = (app) => {
	app.post('/api/contactScan/upload', upload.single('scan'), (req, res) => {
		res.json({"success":true, "url": req.file.filename});
	});
};

