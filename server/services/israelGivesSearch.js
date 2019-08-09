const parser = require('fast-xml-parser');
const request = require("request");


async function getRecentDonations(){
    let startDate = new Date();
    let endDate = new Date();
    //startDate.setMinutes(startDate.getMinutes() -1);
    startDate.setHours(startDate.getHours() - 5);
    endDate.setDate(endDate.getDate() + 1);
    let query = 'https://www.israelgives.org/donationapi/DonationWebService.asmx/DonationsExportToJson';
    const options = {
        method: 'GET',
        url: query,
        qs: {
            UserId: process.env.ISRAEL_GIVES_USER,
            Password:  process.env.ISRAEL_GIVES_PASS,
            StartDate: startDate.toISOString(),
            EndDate: endDate.toISOString()
        },
        headers: {
            'cache-control': 'no-cache'
        }
    };

    return new Promise((resolve, reject)=> {
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            let donations = [];
            try {
                donations = JSON.parse(parser.parse(body).string).data.donors.donor;
            } catch (err) {
                throw Error;
            }
            resolve(donations);
        });
    });

}

module.exports = {
    getRecentDonations
};