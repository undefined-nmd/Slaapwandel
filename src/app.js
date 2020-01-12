import express from 'express';
import path from 'path';
import logger from 'morgan';
import bodyParser from 'body-parser';
import routes from './routes';
import ngrok from 'ngrok';

// twilio details
/*
const accountSid = 'ACfa4f00deb9e5b377b9fa34a7f22e79c5';
const authToken = 'c2cb348bacbbb0e0dda7326ded417364';
const client = require('twilio')(accountSid, authToken);
*/
const app = express();

(async function() {
  const url = await ngrok.connect(8080);
  const apiUrl = ngrok.getUrl();
  const api = ngrok.getApi();
  let data = await api.get('api/tunnels');
  data = JSON.parse(data);
  console.log("saved " + data.tunnels[0].public_url);

})();
app.disable('x-powered-by');

// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(logger('dev', {
  skip: () => app.get('env') === 'test'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/', routes);
app.use('/signup', routes);
app.use('/walkthrough', routes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res
    .status(err.status || 500)
    .render('error', {
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

export default app;
