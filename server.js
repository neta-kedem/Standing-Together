require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cron = require('./server/services/cron');
const Authentication = require('./server/services/authentication');

const dev = process.env.NODE_ENV !== 'production';
// db
const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost/StandingTogether`;
const mongoose = require('mongoose');
// logger
require('winston-daily-rotate-file');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
	return `{ "timestamp": "${timestamp}", "level": "${level}", "message": "${message}" }`;
});

const transport = new (transports.DailyRotateFile)({
	filename: 'log/%DATE%-all.log',
	datePattern: 'YYYY-MM-DD-HH',
	zippedArchive: true,
	maxSize: '20m',
	maxFiles: '1000',
});

const errorTransport = new (transports.DailyRotateFile)({
	filename: 'log/%DATE%-error.log',
	datePattern: 'YYYY-MM-DD-HH',
	zippedArchive: true,
	maxSize: '20m',
	maxFiles: '1000',
	level: 'error'
});

const logger = createLogger({
	format: combine(
			timestamp(),
			myFormat
	),
	transports: [transport, new transports.Console(), errorTransport]
});

console.log = (...args) => logger.info(args)
console.warn = (...args) => logger.warn(args)
console.error = (...args) => logger.error(args)

if(dev){
	mongoose.set('debug', true);
}
//ensures no deprecated functions are used
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(MONGODB_URI, {'useNewUrlParser': true}).then(()=>{});
mongoose.Promise = global.Promise;
const app = express();
//setup server to use accept calls whose body contains files up to 5 mgb
const callSizeLimit = 5;
app.use(bodyParser.urlencoded({extended:false, limit:1024*1024*callSizeLimit, type:'application/x-www-form-urlencoding'}));
app.use(bodyParser.json({limit:1024*1024*callSizeLimit, type:'application/json'}));
app.use(cookieParser());
const auth = function(req, res, next) {
	Authentication.isUser(req, res).then((isUser)=>{
		if (isUser) {
			next();
		}
		else{
			next(false);
			return res.end();
		}
	});
};
app.use('/uploads', auth);
app.use(express.static(path.join(__dirname, 'public')));
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
		deploy(res, "master");
	}
	if(branch.indexOf('nextless') > -1){
		deploy(res, "nextless");
	}
});
const port = process.env.PORT || 5000;

app.listen(port, err => {
	if (err) throw err;
	console.log(`> Ready on port ${port}...`);
});

function deploy(res, branch){
	childProcess.exec(`cd ~/scripts && ./pullST.sh ${branch}`, function(err, stdout, stderr){
		if (err) {
			console.error('DEPLOY ERROR ' + err);
			return res.send(500);
		}
		res.send(200);
	});
}
