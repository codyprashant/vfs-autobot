'use strict';

require('dotenv').config();
require('./app/config/db');
var cron = require('node-cron');
const { vfsAppointmentChecker } = require('./app/controllers/vfsAppointmentChecker');

vfsAppointmentChecker();
// cron.schedule('0 1-23 * * *', () => {
cron.schedule('10,30,50 * * * * ', () => {  
  console.log(vfsAppointmentChecker());
});

