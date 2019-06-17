const mailchimpSync = require('./mailchimpSync');
const wixSync = require('./wixSync');
const SQLSync = require('./SQLSync');
const schedule = require('node-schedule');
const dailySummary = require('./dailySummary');

const scheduleSync = function(){
    const job = schedule.scheduleJob('0 2 * * *', function(){
        mailchimpSync.fetchMembers();
        wixSync.fetchMembers();
        SQLSync.sync();
        dailySummary.sendDailySummary();
    });
};

module.exports = {
    scheduleSync
};