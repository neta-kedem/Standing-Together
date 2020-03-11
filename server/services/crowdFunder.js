const mongoose = require('mongoose');
const israelGivesSearch = require("./israelGivesSearch");
const CrowdfundingDonation = require('../models/crowdfundingDonationModel');

const makeDonation = async function (activistData, sum){
    let donation = null;
    const recentDonations = await israelGivesSearch.getRecentDonations();
    for(let i = 0; i < recentDonations.length; i++){
        if(!recentDonations[i] || !recentDonations[i]["donor_email"] || !recentDonations[i]["donor_email"]["#cdata-section"])
            continue;
        let currEmail = recentDonations[i]["donor_email"]["#cdata-section"].toLowerCase();
        if(currEmail === activistData.email.toLowerCase()) {
            donation = recentDonations[i].donation;
        }
    }
    logDonation(activistData, donation, sum);
    if(!donation) {
        return {"err": "donation not found", "donation": false};
    }
    return {"success":true};
};
const logDonation = function(activistData, donationId, sum) {
    CrowdfundingDonation.create(
        {
            date: new Date(),
            donationId: JSON.stringify(donationId),
            data: JSON.stringify(activistData),
            active: !!donationId,
            sum: sum
        }
    );
};
const getDonatedSum = () => {
    return CrowdfundingDonation.find({active: true}).then(
        (donations)=>{return donations.map(d=>d.sum).reduce((total, num)=>(total+num),0)}
        )
};

module.exports = {
    makeDonation,
    getDonatedSum
};