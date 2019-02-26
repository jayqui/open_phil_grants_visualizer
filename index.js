const cron = require('node-cron');
const express = require('express');
const fs = require('fs');
const moment = require('moment');
const fetch = require('fetch');
const d3 = require('d3-fetch');
if (typeof fetch !== 'function') {
  global.fetch = require('node-fetch-polyfill');
}

app = express();

d3.csv('https://www.openphilanthropy.org/giving/grants/spreadsheet').then(data => {
  console.log(data);
})

// schedule tasks to be run on the server
cron.schedule("* * * * *", function() {
  console.log(`The time is ${moment().hour()}:${moment().minute()}:${moment().second()}`);
});

app.listen(3128);
