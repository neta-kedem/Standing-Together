const mongoose = require('mongoose');
const Activist = require('../models/activistModel');
const mailchimpSync = require('../services/mailchimpSync');
const circleFetcher = require("./circleFetcher");
const cityFetcher = require("./cityFetcher");
const activistsFetcher = require("./activistsFetcher");
const arrayFunctions = require("./arrayFunctions");


const updateTypedActivists = function(activists){
    const today = new Date();
    let updatePromises = [];
    for(let i=0; i<activists.length; i++){
        const curr = activists[i];
        const query = Activist.updateOne({'_id':curr._id}, {
            "profile.firstName" : curr.firstName,
            "profile.lastName" : curr.lastName,
            "profile.phone" : curr.phone.replace(/[\-.():]/g, ''),
            "profile.email" : curr.email,
            "profile.residency" : curr.residency,
            "metadata.lastUpdate" : today,
        });
        updatePromises.push(query.exec());
    }
    return Promise.all(updatePromises);
};
const insertActivists = function(req, res){
    const newActivist = new Activist(req.body);
    newActivist.save(function (err) {
        if (err){
            return res.json(err);
        }
        else
            return res.json(req.body);
    });
};
const addToMailchimpCircle = function(activists){
    if(!activists || !activists.length){
        return true;
    }
    let updatePromises = [];
    const fetchPromises = [cityFetcher.getCities(), circleFetcher.getCircles()];
    Promise.all(fetchPromises).then((results)=>{
            const cities = arrayFunctions.indexByField(results[0], "name");
            const circles = arrayFunctions.indexByField(results[1], "name");
            for(let i = 0; i < activists.length; i++){
                let curr = activists[i];
                if (curr.profile.residency
                    && cities[curr.profile.residency]
                    && cities[curr.profile.residency].defaultCircle
                    && circles[cities[curr.profile.residency].defaultCircle]
                    && circles[cities[curr.profile.residency].defaultCircle].mailchimpList
                ){
                    updatePromises.push(mailchimpSync.createContacts([curr], circles[cities[curr.profile.residency].defaultCircle].mailchimpList));
                }
            }
        }
    );
    return Promise.all(updatePromises);
};
const checkForDuplicates = function (activists){
    const phones = activists.map((a)=>{return a.profile.phone}).filter(phone => phone && phone.length > 3);
    const emails = activists.map((a)=>{return a.profile.email}).filter(email => email && email.length > 3);
    const duplicates = activistsFetcher.searchDuplicates(phones, emails).then(duplicates => {
        const duplicatesByPhone = arrayFunctions.indexByField(duplicates, "phone");
        const duplicatesByEmail = arrayFunctions.indexByField(duplicates, "email");
        for(let i = 0; i < activists.length; i++){
            if(duplicatesByPhone[activists[i].profile.phone]){
                activists[i].metadata.duplicateId = duplicatesByPhone[activists[i].profile.phone]._id;
            }
            if(duplicatesByEmail[activists[i].profile.email]){
                activists[i].metadata.duplicateId = duplicatesByEmail[activists[i].profile.email]._id;
            }
        }
        return activists;
    });
    return duplicates;
};
const registerMember = function (req, res){
        const activistData = req.body.activistData;
        const transactionId = req.body.transactionId;
        const today = new Date();
        const activistObject ={
            "_id": mongoose.Types.ObjectId(),
            "metadata" : {
                "creationDate" : today,
                "lastUpdate" : today,
                "joiningMethod" : "webSite",
            },
            "profile" : {
                "firstName" : activistData.firstName,
                "lastName" : activistData.lastName,
                "phone" : activistData.phone.replace(/[\-.():]/g, ''),
                "email" : activistData.email,
                "residency" : activistData.residency,
                "circle" : "תל-אביב",
                "isMember" : true,
                "isPaying" : true
            },
            "membership" : {
                "joiningDate" : today,
                "street" : activistData.street,
                "houseNum" : activistData.houseNum,
                "apartmentNum" : activistData.apartmentNum,
                "mailbox" : activistData.mailbox,
                "TZ" : activistData.TZ,
                "birthday" : activistData.birthday
            },
            "role" : {
                "isTyper" : false,
                "isCaller" : false,
                "isOrganizer" : false,
                "isCircleLeader" : false
            },
            "login" : {
                "loginCode" : null,
                "token" : []
            },
        };
        updateTypedActivists(updatedActivists).then(()=>{
            //mark activists whose phones or emails are already stored
            checkForDuplicates(newActivists).then(()=>{
                Activist.insertMany(newActivists).then(function (result) {
                    if (result){
                        let tasks = [];
                        //create a mailchimp record in the main contact list
                        //tasks.push(mailchimpSync.createContacts(newActivists));
                        //create a mailchimp record in the circle-specific contact list
                        tasks.push(addToMailchimpCircle(newActivists));
                        //mark the activist as typed in the relevant contact scan
                        if(scanId){
                            tasks.push(markTypedContactScanRows(res, typerId, scanId, newActivists, markedDone));
                        }
                        Promise.all(tasks).then((results)=>{
                            return res.json(results);
                        })
                    }
                    else{
                        return res.json({"error":"an unknown error has occurred, the activists were not saved"});
                    }
                });
            });
        });
};

module.exports = {
    uploadTypedActivists,
    toggleActivistStatus,
    insertActivists
};