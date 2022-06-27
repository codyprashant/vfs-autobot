'use strict';

require('dotenv').config();
require('./app/config/db');
var cron = require('node-cron');
const { vfsAppointmentChecker } = require('./app/controllers/vfsAppointmentChecker');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  var result = 'App is running'
  response.send(result);
}).listen(app.get('port'), function() {
  const ENVIROINMENT = process.env.NODE_ENV || 'development';
  const message = `Server Listening On Port ${process.env.PORT}, ENVIROINMENT=${ENVIROINMENT}`;
  // eslint-disable-next-line no-console
  console.log(message);
});

vfsAppointmentChecker();
// cron.schedule('0 1-23 * * *', () => {
cron.schedule('10,30,50 * * * * ', () => {  
  console.log(vfsAppointmentChecker());
});

