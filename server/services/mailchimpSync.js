const fetch = require('node-fetch');
const Activist = require('../models/activistModel');
const config = require('../config');
//a6f28b7b74 test list id
const fetchMembers = function(req, res){
    let date = new Date();
    date.setMonth(date.getMonth()-1);
    const url = 'https://us14.api.mailchimp.com/3.0/lists/a6f28b7b74/members?' +
        'fields=members.email_address,members.status' +
        '&since_last_changed='+date.toISOString();
    const promise = fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': config.mailChimpKey
        },
        credentials: 'same-origin'
    }).then(res => res.json())
        .then(contacts => {
            if(!contacts || !contacts.members.length)
                return res.json(contacts.members);
            updateNewsletterStatus(contacts.members).then(()=>{
                return res.json(contacts.members);
            })
        });
    return promise;
};
const updateNewsletterStatus = function(contacts){
    let updatePromises = [];
    for(let i=0; i<contacts.length; i++){
        const curr = contacts[i];
        const query = Activist.updateOne({'profile.email':curr.email_address}, {
            "profile.isNewsletter" : curr.status
        });
        updatePromises.push(query.exec());
    }
    return Promise.all(updatePromises);
};
const createContacts = function(contacts){
    let updatePromises = [];
    for(let i=0; i<contacts.length; i++){
        const contact = contacts[i];
        const url = 'https://us14.api.mailchimp.com/3.0/lists/a6f28b7b74/members/';
        const data = {
            "email_address": contact.profile.email,
            "merge_fields": {
                "FNAME": contact.profile.firstName,
                "LNAME": contact.profile.lastName,
                "PHONE": contact.profile.phone
            },
            "status": "subscribed",
            "tags": ["added automatically"]
        };
        const query = {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(data).length,
                'Authorization': config.mailChimpKey,
            },
            body: JSON.stringify(data),
            credentials: 'same-origin'
        };
        updatePromises.push(fetch(url, query));
    }
    return Promise.all(updatePromises);
};

module.exports = {
    fetchMembers,
    createContacts
};

