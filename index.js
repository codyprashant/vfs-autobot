'use strict';

require('dotenv').config();
require('./app/config/db');
var cron = require('node-cron');
const { vfsAppointmentChecker } = require('./app/controllers/vfsAppointmentChecker');
const express = require('express');
const destination = process.env.DESTINATION_COUNTRY
const origin = process.env.SOURCE_COUNTRY
const email  = process.env.VFS_EMAIL
const password = process.env.VFS_PASSWORD


const app = express();
app.set('port', (process.env.PORT));

app.get('/', function(request, response) {
  var result = 'App is running'
  response.send(result);
}).listen(app.get('port'), function() {
  const ENVIROINMENT = process.env.NODE_ENV || 'development';
  const message = `Server Listening On Port ${process.env.PORT}, ENVIROINMENT=${ENVIROINMENT}`;
  // eslint-disable-next-line no-console
  console.log(message);
});

vfsAppointmentChecker(destination, origin, email, password);
// cron.schedule('0 1-23 * * *', () => { \\ every hour
cron.schedule('10 * * * * ', () => {  
  console.log(vfsAppointmentChecker(destination, origin));
});

