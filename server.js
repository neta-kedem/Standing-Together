const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost/StandingTogether`;
const mongoose = require('mongoose');

mongoose.Promise = Promise;

app.prepare().then(() => {
  // use this to query the db
  // mongoose.connect(MONGODB_URI);
  // const db = mongoose.connection;
  // db.on('error', console.error.bind(console, 'connection error:'));
  // db.once('open').then(...)

  createServer((req, res) => {
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
    } else {
      handle(req, res, parsedUrl)
    }
  }).listen(3000, err => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  })
});
