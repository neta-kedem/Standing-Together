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
const winston = require('winston');
const { createLogger, format, transports } = winston;
const { combine, timestamp, printf } = format;
require('winston-mongodb');
const expressWinston = require('express-winston')

const myFormat = printf(({ level, message, timestamp }) => {
	return `{ "timestamp": "${timestamp}", "level": "${level}", "message": "${message}" }`;
});

const transport = new (transports.DailyRotateFile)({
	filename: 'logs/%DATE%-all.log',
	datePattern: 'YYYY-MM-DD',
	zippedArchive: true,
	maxSize: '20m',
	maxFiles: '1000',
});

const errorTransport = new (transports.DailyRotateFile)({
	filename: 'logs/%DATE%-error.log',
	datePattern: 'YYYY-MM-DD-HH',
	zippedArchive: false,
	maxSize: '20m',
	maxFiles: '1000',
	level: 'error'
});

const options = {
	db: MONGODB_URI,
	collection: 'logs',
	level: 'info',
	storeHost: true,
	capped: true
}

const logger = createLogger({
	format: combine(
			timestamp(),
			myFormat
	),
	transports: [transport, new transports.Console(), errorTransport, new winston.transports.MongoDB(options)]
});

console.log = (...args) => logger.info(args)
console.warn = (...args) => logger.warn(args)
console.error = (...args) => logger.error(args)

const init = (logger) => expressWinston.logger({
	winstonInstance: logger, // a winston logger instance. If this is provided the transports option is ignored.
	msg: 'HTTP {{res.statusCode}} {{req.method}} {{req.url}} {{res.responseTime}}ms {{JSON.stringify(req.body)}}', // customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}", "HTTP {{req.method}} {{req.url}}".
	expressFormat: false, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors when colorize set to true
	bodyWhitelist: ["body"] // Array of body properties to log. Overrides global bodyWhitelist for this instance
})

if(dev){
	mongoose.set('debug', true);
}
//ensures no deprecated functions are used
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(MONGODB_URI, {'useNewUrlParser': true, 'useUnifiedTopology': true}).then(()=>{}).catch(err=>{
	console.log("Please start your mongodb server.");
	process.exit(1);
});
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
app.use(init(logger));
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
});
const port = process.env.PORT || 5000;

app.listen(port, err => {
	if (err) throw err;
	console.log(`> Ready on port ${port}...`);
});

function deploy(res, branch){
	childProcess.exec(`. ~/scripts/pullST.sh ${branch}`, function(err, stdout, stderr){
		if (err) {
			console.error('DEPLOY ERROR ' + err);
			return res.send(500);
		}
		res.send(200);
	});
}
