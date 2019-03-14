const fetch = require('node-fetch');
const config = require('../config');
//a6f28b7b74 test list id
const fetchLists = function(req, res){
    let date = new Date();
    date.setMonth(date.getMonth()-1);
    const url = 'https://us14.api.mailchimp.com/3.0/lists/';
    const promise = fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': config.mailChimpKey
        },
        credentials: 'same-origin'
    }).then(res => res.json())
        .then(lists => {
            res.json(lists);
        });
    return promise;
};

module.exports = {
    fetchLists
};