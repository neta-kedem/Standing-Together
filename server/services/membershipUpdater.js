const mongoose = require('mongoose');
const Activist = require('../models/activistModel');
const MemberRegistrationLog = require('../models/memberRegistrationModel');
const mailchimpSync = require('../services/mailchimpSync');
const circleMatcher = require("./circleMatcher");
const activistDuplicateDetector = require("./activistDuplicateDetector");
const israelGivesSearch = require("./israelGivesSearch");
const util = require('util');

const addToCircle = function(activist){
    if(!activist || !activist.profile.residency){
        return new Promise((resolve) => {resolve(activist)});
    }
    return circleMatcher.getCircleByCity(activist.city).then((circle)=>{
        if(!circle)
            return activist;
        activist.profile.circle = circle._id;
        if(activist.profile.circle && circle.mailchimpList)
            activist.push(mailchimpSync.createContacts([activist], circle.mailchimpList));
        return activist;
    });
};

const logRegistration = function(activistData, donationId) {
    MemberRegistrationLog.create(
        {
            date: new Date(),
            donationId: JSON.stringify(donationId),
            data: JSON.stringify(activistData)
        }
    );
};

const registerMember = async function (activistData){
    let donationId = null;
    const recentDonations = await israelGivesSearch.getRecentDonations();
    //iterate over recent donations, look for one corresponding to the email of the new member
    for(let i = 0; i < recentDonations.length; i++){
        if(!recentDonations[i] || !recentDonations[i]["donor_email"] || !recentDonations[i]["donor_email"]["#cdata-section"])
            continue;
        let currEmail = recentDonations[i]["donor_email"]["#cdata-section"].toLowerCase();
        if(currEmail === activistData.email.toLowerCase()) {
            donationId = recentDonations[i].donation;
            console.log(util.inspect(donationId, {showHidden: false, depth: null}));
        }
    }
    logRegistration(activistData, donationId);
    if(!donationId) {
        return {"err": "donation not found"};
    }
    const today = new Date();
    const activistObject = {
        "_id": mongoose.Types.ObjectId(),
        "metadata" : {
            "creationDate" : today,
            "lastUpdate" : today,
            "joiningMethod" : "memberPage",
        },
        "profile" : {
            "firstName" : activistData.firstName,
            "lastName" : activistData.lastName,
            "phone" : activistData.phone.replace(/[\-.():]/g, ''),
            "email" : activistData.email.toLowerCase(),
            "residency" : activistData.residency,
            "isMember" : true,
            "isPaying" : true
        },
        "membership" : {
            "joiningDate" : today,
            "street" : activistData.street,
            "houseNum" : activistData.houseNum,
            "apartmentNum" : activistData.apartmentNum,
            "mailbox" : activistData.mailbox,
            "TZ" : activistData.tz,
            "birthday" : activistData.birthday,
            "transactionId" : null
        },
        "role" : {
            "isTyper" : false,
            "isCaller" : false,
            "isOrganizer" : false,
            "isCircleLeader" : false
        }
    };
    //detect activists in our system that share a phone/email with the new member
    return activistDuplicateDetector.checkForDuplicates([activistObject]).then(()=>{
        //if there is a circle corresponding to the member's city, add it to their details
        //and add them to the appropriate mailchimp circle
        return addToCircle(activistObject).then(()=>{
            //if the new member already exists in our system
            if(activistObject.metadata.duplicateId){
                //update just the profile, membership, and lastUpdate fields - the rest might hold important information
                const query = Activist.updateOne({"_id": activistObject.metadata.duplicateId}, {$set: {
                        "profile": activistObject.profile,
                        "membership": activistObject.membership,
                        "metadata.lastUpdate": activistObject.metadata.lastUpdate
                    }});
                return query.exec().then(()=>{
                    return true;
                }).catch((err)=>{
                    console.log(err);
                    //catch errors updating the new member's details in our db
                    return err;
                });
            }
            else{
                //if the member doesn't already appear in our db
                return Activist.create(activistObject).then(()=>{
                    return true;
                }).catch((err)=>{
                    console.log(err);
                    //catch errors inserting the new member's details in our db
                    return err;
                });
            }
        });
    });
};

module.exports = {
    registerMember
};