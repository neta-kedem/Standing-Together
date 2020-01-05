const TrackedLink = require('../models/trackedLink');

const track = function(url, data){
    const today = new Date();
    const linkObject = {usageDate: today, url: url, data: data};
    const query = TrackedLink.create(linkObject);
    return query;
};
module.exports = {
    track
};

