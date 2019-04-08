const mailchimpSync = require('./mailchimpSync');
const wixSync = require('./wixSync');
const schedule = require('node-schedule');

const scheduleSync = function(){
    const job = schedule.scheduleJob('0 2 * * *', function(){
        mailchimpSync.fetchMembers();
        wixSync.fetchMembers();
    });
};

module.exports = {
    scheduleSync
};