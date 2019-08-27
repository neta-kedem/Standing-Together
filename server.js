require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cron = require('./server/services/cron');
const authentication = require('./server/services/authentication');
const SQLSync = require('./server/services/SQLSync');
const dbFixer = require('./server/services/dbFixer');

const dev = process.env.NODE_ENV !== 'production';
//db
const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost/StandingTogether`;
const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }).then(()=>{});
mongoose.Promise = global.Promise;
const app = express();
//setup server to use accept calls whose body contains files up to 5 mgb
const callSizeLimit = 5;
app.use(bodyParser.urlencoded({extended:false, limit:1024*1024*callSizeLimit, type:'application/x-www-form-urlencoding'}));
app.use(bodyParser.json({limit:1024*1024*callSizeLimit, type:'application/json'}));
app.use(cookieParser());
const auth = function(req, res, next) {
	authentication.isUser(req, res).then((isUser)=>{
		if (isUser) {
			next();
		}
		else{
			res.redirect('/Login');
			next(false);
			res.end();
		}
	});
};
app.use('/uploads', auth);
app.use(express.static('public'));
//set cron
cron.scheduleSync();
const childProcess = require('child_process');

// API routes
require('./server/routes')(app);

app.post("/webhooks/github", function (req, res) {
	const sender = req.body.sender;
	const branch = req.body.ref;

	console.log('in webhook', branch, sender.login);

	if(branch.indexOf('master') > -1){
		deploy(res);
	}
});
app.get('/admin/sync', (req, res) => {
	Authentication.hasRole(req, "isOrganizer").then(user=>{
		if(!user)
		{
			res.end();
		}
		else{
			SQLSync.syncAll().then(()=>{
				return true
			});
		}
	});
});
app.get('/admin/fixDB', (req, res) => {
	Authentication.hasRole(req, "isOrganizer").then(user=>{
		if(!user)
		{
			res.end();
		}
		else{
			dbFixer.idifyParticipatedEvents().then(()=>{
				return true
			});
		}
	});
});
// THIS IS THE DEFAULT ROUTE, DON'T EDIT THIS
app.get('*', (req, res) => {
	return app.render('/Login', req.query);
});
const port = process.env.PORT || 5000;

app.listen(port, err => {
	if (err) throw err;
	console.log(`> Ready on port ${port}...`);
});

function deploy(res){
	childProcess.exec('cd ~/scripts && ./pullST.sh', function(err, stdout, stderr){
		if (err) {
			console.error(err);
			return res.send(500);
		}
		res.send(200);
	});
}