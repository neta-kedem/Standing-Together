const fetch = require('node-fetch');
const fetchLists = function(req, res){
    let date = new Date();
    date.setMonth(date.getMonth()-1);
    const url = 'https://us14.api.mailchimp.com/3.0/lists?fields=lists.name,lists.id&count=30';
    const promise = fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': process.env.MAILCHIMP_KEY
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