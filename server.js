const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const router = express.Router();
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost/StandingTogether`;
const mongoose = require('mongoose');

const authentication = require('./server/services/authentication');

mongoose.connect(MONGODB_URI);
mongoose.Promise = global.Promise;
const server = express();
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(cookieParser());

app.prepare().then(() => {
	// API routes
	require('./server/routes')(server);
	
	// CUSTOM ROUTES GO HERE
	server.get('/Organizer', (req, res) => {
		authentication.hasRole(req, res, "isOrganizer").then(user=>{
			if(!user)
			{
				res.redirect('/Login');
				res.end();
			}
			else{
				app.render(req, res, '/Organizer', req.query);
			}
		});
	});
	server.get('/EventCreation', (req, res) => {
		authentication.hasRole(req, res, "isOrganizer").then(user=>{
			if(!user)
			{
				res.redirect('/Login');
				res.end();
			}
			else{
				app.render(req, res, '/EventCreation', req.query);
			}
		});
	});
	server.get('/Typer', (req, res) => {
		authentication.hasRole(req, res, "isTyper").then(user=>{
			if(!user)
			{
				res.redirect('/Login');
				res.end();
			}
			else{
				app.render(req, res, '/Typer', req.query);
			}
		});
	});
	server.get('/Caller', (req, res) => {
		authentication.hasRole(req, res, "isCaller").then(user=>{
			if(!user)
			{
				res.redirect('/Login');
				res.end();
			}
			else{
				app.render(req, res, '/Caller', req.query);
			}
		});
	});
	server.get('/Login', (req, res) => {
		return app.render(req, res, '/Login', req.query);
	});
	// THIS IS THE DEFAULT ROUTE, DON'T EDIT THIS 
	server.get('*', (req, res) => {
		return handle(req, res);
	});
	const port = process.env.PORT || 3000;

	server.listen(port, err => {
		if (err) throw err;
		console.log(`> Ready on port ${port}...`);
	});
  // use this to query the db
  // mongoose.connect(MONGODB_URI);
  // const db = mongoose.connection;
  // db.on('error', console.error.bind(console, 'connection error:'));
  // db.once('open').then(...query...)
  /*createServer((req, res) => {
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true);

    const { pathname, query } = parsedUrl;
    if (pathname === '/Organizer') {
      app.render(req, res, '/Organizer', query);
    } else if (pathname === '/Typer') {
      app.render(req, res, '/Typer', query)
    } else if (pathname === '/') {
      app.render(req, res, '/', query)
    } else if (pathname === '/Login') {
      app.render(req, res, '/Login', query)
    } else if (pathname === '/EventCreation') {
      app.render(req, res, '/EventCreation', query)
    } else {
      handle(req, res, parsedUrl)
    }
  }).listen(port, err => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  })*/
});
