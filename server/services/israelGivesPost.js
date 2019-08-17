const fetch = require('node-fetch');
const config = require('../config');

const payForMembership = function(paymentData){
        const url = config.israelGivesApiPath;
        const data = paymentData;
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
        return fetch(url, query);
};

module.exports = {
    payForMembership
};

