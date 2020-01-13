'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _ngrok = require('ngrok');

var _ngrok2 = _interopRequireDefault(_ngrok);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// twilio details
/*
const accountSid = 'ACfa4f00deb9e5b377b9fa34a7f22e79c5';
const authToken = 'c2cb348bacbbb0e0dda7326ded417364';
const client = require('twilio')(accountSid, authToken);
*/
const app = (0, _express2.default)();

app.use((0, _cors2.default)());

(async function () {
  const url = await _ngrok2.default.connect(8080);
  const apiUrl = _ngrok2.default.getUrl();
  const api = _ngrok2.default.getApi();
  let data = await api.get('api/tunnels');
  data = JSON.parse(data);
  console.log("saved " + data.tunnels[0].public_url);
})();
app.get('/ngrok', function (req, res, next) {
  res.json({ msg: 'This is CORS-enabled for a Single Route' });
});
app.disable('x-powered-by');

// View engine setup
app.set('views', _path2.default.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use((0, _morgan2.default)('dev', {
  skip: () => app.get('env') === 'test'
}));
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_express2.default.static(_path2.default.join(__dirname, '../public')));

// Routes
app.use('/', _routes2.default);
app.use('/signup', _routes2.default);
app.use('/walkthrough', _routes2.default);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  res.status(err.status || 500).render('error', {
    message: err.message
  });
});

//function to send an sms to the parent when Anna hasn't woken up yet
/*const sendSMS = () => {
  client.messages
  .create({
     body: 'Anna is nog niet wakker geworden!',
     from: '+32460207022',
     to: '+32497313223'
   })
  .then(message => console.log("de message id is" + message.sid));
}*/

exports.default = app;
//# sourceMappingURL=app.js.map