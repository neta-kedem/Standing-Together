const fetch = require('node-fetch');
const Activist = require('../models/activistModel');
const config = require('../config');

const fetchMembers = function(){
    let date = new Date();
    date.setMonth(date.getMonth()-1);
    const url = config.wixApiPath+'members';
    const promise = fetch(url, {
        "async": true,
        "crossDomain": true,
        "method": "GET",
        "headers": {
            "key": "sbvwh7lo43bTyvWNGutS75fCksORr29zsrDPxGBO",
            "cache-control": "no-cache"
        }
    }).then(res => res.json())
        .then(contacts => {
            if(!contacts || !contacts.members.length)
                return false;
            updateMembershipStatus(contacts.members).then(()=>{
                return true;
            })
        });
    return promise;
};
const updateMembershipStatus = function(contacts){
    let updatePromises = [];
    for(let i=0; i<contacts.length; i++){
        const curr = contacts[i];
        const query = Activist.updateOne({'profile.email':curr.email}, {
            "profile.isMember" : true,
            "profile.isPaying" : true
        });
        updatePromises.push(query.exec());
    }
    return Promise.all(updatePromises);
};

module.exports = {
    fetchMembers
};

