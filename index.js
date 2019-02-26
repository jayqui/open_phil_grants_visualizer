const cron = require('node-cron');
const express = require('express');
const fs = require('fs');
const moment = require('moment');

app = express();

// schedule tasks to be run on the server
cron.schedule("* * * * *", function() {
  console.log(`The time is ${moment().hour()}:${moment().minute()}:${moment().second()}`);
});

app.listen(3128);
