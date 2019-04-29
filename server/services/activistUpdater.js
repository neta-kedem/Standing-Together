const mongoose = require('mongoose');
const Activist = require('../models/activistModel');
const ContactScan = require('../models/contactScanModel');
const Authentication = require('../services/authentication');
const mailchimpSync = require('../services/mailchimpSync');
const circleFetcher = require("./circleFetcher");
const cityFetcher = require("./cityFetcher");
const activistsFetcher = require("./activistsFetcher");
const arrayFunctions = require("./arrayFunctions");

const markTypedContactScanRows = function(typerId, scanId, activists, markedDone){
    const today = new Date();
    return ContactScan.findOne(
        {"_id": scanId}).exec() .then(() => {
            // link to the new activists that have been typed
            let associatedActivists = [];
            for(let i = 0; i < activists.length; i++){
                const activist = activists[i];
                associatedActivists.push({
                    "creationDate": today,
                    "lastUpdate": today,
                    "typerId": typerId,
                    "activistId": activist._id,
                    "new": !activist.metadata.duplicateId,
                    "pos": activist.pos,
                    "comments": activist.profile.comments
                });
            }
            const updateQuery = ContactScan.updateOne(
                {"_id": scanId},
                {"complete": markedDone, $push: { activists: { $each: associatedActivists } } }
            ).exec().then(()=> {
                return true;
            });
            return updateQuery;
        }
    );
};
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
const toggleActivistStatus = function(req, res){
    Authentication.hasRole(req, res, "isOrganizer").then(isUser=>{
        if(!isUser)
            return res.json({"error":"missing token"});
        const activistId = req.body.activistId;
        const isCaller = req.body.status;
        let query = Activist.update({'_id':activistId},{'role.isCaller': isCaller});
        return query.exec().then(()=>{
            return res.json({"result":"set status to "+isCaller+" for user "+activistId});
        });
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
const uploadTypedActivists = function (req, res){
    Authentication.hasRole(req, res, "isTyper").then(isUser=>{
        if(!isUser)
            return res.json({"error":"missing token"});
        const typerId = Authentication.getMyId();
        const typedActivists = req.body.activists;
        const scanId = req.body.scanId ? mongoose.Types.ObjectId(req.body.scanId) : null;
        const markedDone = req.body.markedDone;
        //activists who don't have an id attached
        let newActivists = [];
        //activists whose records have already been typed and submitted as part of this specific scan page,
        //and have subsequently been updated by some typer.
        let updatedActivists = [];
        const today = new Date();
        for (let i=0; i<typedActivists.length; i++)
        {
            let curr = typedActivists[i];
            if(!curr._id){
                newActivists.push(
                    {
                        "_id": mongoose.Types.ObjectId(),
                        "metadata" : {
                            "creationDate" : today,
                            "lastUpdate" : today,
                            "joiningMethod" : "contactPage",
                            "typerId" : typerId,
                            "scanId": scanId,
                            "scanRow": curr.scanRow
                        },
                        "profile" : {
                            "firstName" : curr.firstName,
                            "lastName" : curr.lastName,
                            "phone" : curr.phone.replace(/[\-.():]/g, ''),
                            "email" : curr.email,
                            "residency" : curr.residency,
                            "comments" : curr.comments,
                            "circle" : "תל-אביב",
                            "isMember" : false,
                            "isPaying" : false,
                            "isNewsletter" : "not subscribed",
                            "participatedEvents" : []
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
                        "pos": i
                    }
                );
            }
            else{
                if(!curr.locked) {
                    updatedActivists.push(curr);
                }
            }
        }
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
                            tasks.push(markTypedContactScanRows(typerId, scanId, newActivists, markedDone));
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
    });
};

module.exports = {
    uploadTypedActivists,
    toggleActivistStatus,
    insertActivists
};