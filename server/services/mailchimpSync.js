const fetch = require('node-fetch');
const Activist = require('../models/activistModel');
const settingsManager = require('../services/settingsManager');
//the web id of the main contact list - all our contacts should appear in this list
const fetchMembers = async function () {
    let date = new Date();
    const mainListId = await settingsManager.getSettingByName("dailySummaryRecipients");
    date.setMonth(date.getMonth() - 1);
    const url = 'https://us14.api.mailchimp.com/3.0/lists/' + mainListId + '/members?' +
        'fields=members.email_address,members.status' +
        '&since_last_changed=' + date.toISOString();
    const promise = fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': process.env.MAILCHIMP_KEY
        },
        credentials: 'same-origin'
    }).then(res => res.json())
        .then(contacts => {
            if (!contacts || !contacts.members.length)
                return false;
            updateNewsletterStatus(contacts.members).then(() => {
                return true;
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

const createContacts = async function (contacts, list = null) {
    const mainListId = await settingsManager.getSettingByName("dailySummaryRecipients");
    if (process.env.NODE_ENV === 'development')
        return new Promise((resolve) => {
            resolve(true)
        });
    let updatePromises = [];
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        const url = 'https://us14.api.mailchimp.com/3.0/lists/' + (list ? list : mainListId) + '/members/';
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
                'Authorization': process.env.MAILCHIMP_KEY,
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