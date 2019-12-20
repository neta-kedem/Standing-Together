const mongoose = require('mongoose');
const Activist = require('../models/activistModel');
const ContactScan = require('../models/contactScanModel');
const Authentication = require('../services/authentication');
const mailchimpSync = require('../services/mailchimpSync');
const circleFetcher = require("./circleFetcher");
const contactScanFetcher = require("./contactScanFetcher");
const cityFetcher = require("./cityFetcher");
const activistsFetcher = require("./activistsFetcher");
const arrayFunctions = require("./arrayFunctions");

/**
 * @param activists
 * gets an array of activist objects, complete with an _id field for each one, and under the assumption that they appear in the db, updates their details
 * @returns {Promise<any[]>} - the promise, once resolved, returns an array of all the update query results - one for each activist
 */
const updateActivists = function(activists){
    let updateQueries = [];
    for(let i = 0; i < activists.length; i++)
    {
        let a = activists[i];
        updateQueries.push(Activist.updateOne({_id: mongoose.Types.ObjectId(a._id)},
            {role: a.role, profile: a.profile, membership: a.membership, "metadata.lastUpdate": new Date()}).exec());
    }
    return Promise.all(updateQueries);
};

/**
 * @param typerId - the _id of the activist who typed in the data from some contact page scan
 * @param scanId - the _id of the scanned contact page
 * @param activists - the list of all activists whose data has been typed in according to that scanned contact page
 * @param markedDone - whether or not the typer indicated that they have completed typing in all the data from the scan
 * updates relevant details of the contactScan object which the typer used as a reference. This consists of:
 * 1) updating the "lastUpdate" and "complete" fields, as necessary
 * 2) update the associatedActivists array
 * this array keeps the details of all activists whose details have been typed in from the relevant contact scan
 * activists are
 * @returns {Promise<any[]>} - the promise, once resolved, returns the result of the scan update query
 */
const markTypedContactScanRows = function(typerId, scanId, activists, markedDone){
    const today = new Date();
    const scanObjectId = mongoose.Types.ObjectId(scanId);
    return ContactScan.findOne(
        {"_id": scanObjectId}).exec().then((scanData) => {
            // a dictionary of activists already associated with the scan, key'd by their _id
            let associatedActivists = arrayFunctions.indexByField(scanData.activists, "activistId");
            for(let i = 0; i < activists.length; i++){
                //iterate over the up to date array of activists
                const activist = activists[i];
                //for each activist, determine whether it is already associated with this scan, by searching for them in the associated activists dictionary
                if(!associatedActivists[activist._id]){
                    //update data on newly typed activists
                    //(again, here "new" means "new to the list of activists associated with this specific scan", not "new to the system")
                    associatedActivists[activist._id]={
                        "creationDate": today,
                        "lastUpdate": today,
                        "typerId": typerId,
                        "activistId": activist._id,
                        "new": activist.new,
                        "pos": activist.pos,
                        "comments": activist.comments
                    };
                }
                //update data on existing activists (i.e. activists whose details were already typed as part of this scan, and were edited retroactively).
                else{
                    associatedActivists[activist._id].lastUpdate = today;
                    associatedActivists[activist._id].comments = activist.comments;
                    associatedActivists[activist._id].typerId = typerId;
                }
            }
            //update the scan object with an up to date associatedActivists array, and appropriate "complete" and "lastUpdate" values
            associatedActivists = Object.values(associatedActivists);
            const updateQuery = ContactScan.updateOne(
                {"_id": scanObjectId},
                {"complete": markedDone, activists: associatedActivists, "metadata.lastUpdate": today}
            ).exec().then((res)=> {
                return res;
            });
            return updateQuery;
        }
    );
};
/**
 * @param activists - an array of activists presumed to have been previously typed as part of this particular scan,
 * and subsequently having some of their details altered.
 * TODO: note - this presents a problem - it allows any typer to arbitrarily alter the details of pre-existing activists in the system,
 * by typing in their details, hitting save, and then editing them and hitting save again.
 * @returns {Promise<any[]>} - one resolved, the promise returns an array of all update query results (one for each activist)
 */
const updateTypedActivists = function(activists){
    const today = new Date();
    let updatePromises = [];
    for(let i=0; i<activists.length; i++){
        const curr = activists[i];
        const query = Activist.updateOne({'_id':curr._id}, {
            "profile.firstName" : curr.firstName,
            "profile.lastName" : curr.lastName,
            "profile.phone" : curr.phone.replace(/[\-.():]/g, ''),
            "profile.email" : curr.email.toLowerCase(),
            "profile.residency" : curr.residency,
            "metadata.lastUpdate" : today,
        });
        updatePromises.push(query.exec());
    }
    return Promise.all(updatePromises);
};
/**
 * @param activists - a list of activists that have existed in the system prior to being typed in as part of the current contact scan
 * @param eventId - the id of the event associated with the uploaded scan - it is added to the array of events the activists have taken part in
 * for each such activist, update the lastUpdate field, and the list of events they have participated in
 * @returns {Promise<any[]>}
 */
const updateDuplicateActivists = function(activists, eventId){
    const today = new Date();
    let updatePromises = [];
    for(let i=0; i<activists.length; i++){
        const curr = activists[i];
        //$addToSet is like $push, but doesn't allow duplicates
        const query = Activist.updateOne({'_id':curr._id}, {
            $addToSet: { "profile.participatedEvents": eventId },
            "metadata.lastUpdate" : today
        });
        updatePromises.push(query.exec());
    }
    return Promise.all(updatePromises);
};
/**
 * @param activists - a list of activists
 * matches each activist with a circle, according to their residency field.
 * NOTE - be careful not to use this on existing activists, as it might override manual changes to their circle field
 * @returns {*} - once resolved, the activists array will contain a circle field (profile.circle)
 */
const determineActivistsCircles = function(activists){
    //default behaviour in case an empty/invalid activists list is provided
    if(!activists || !activists.length){
        return new Promise((resolve)=> {
            resolve([]);
        });
    }
    return cityFetcher.getCities().then((cities)=>{
            const cityDict = arrayFunctions.indexByField(cities, "nameHe");
            for(let i = 0; i < activists.length; i++){
                let curr = activists[i];
                if (curr.profile.residency
                    && cityDict[curr.profile.residency]
                    && cityDict[curr.profile.residency].defaultCircle
                ){
                    curr.profile.circle = cityDict[curr.profile.residency].defaultCircle;
                }
            }
            return activists
        }
    );
};
/**
 * @param activists
 * adds each activist to the appropriate email list, as determined by their circle attribute
 * @returns {Promise<any[]>} - once resolved, returns an array of all mailchimp subscription attempts results
 */
const addToRegionalMailchimpCircle = function(activists){
    //default behaviour in case an empty/invalid activists list is provided
    if(!activists || !activists.length){
        return new Promise((resolve)=> {
            resolve([]);
        });
    }
    let updatePromises = [];
    circleFetcher.getCircles().then((circles)=>{
        const circlesDict = arrayFunctions.indexByField(circles, "name");
        for(let i = 0; i < activists.length; i++){
            let curr = activists[i];
            if (curr.profile.circle && circlesDict[curr.profile.circle]){
                updatePromises.push(mailchimpSync.createContacts([curr], circlesDict[curr.profile.circle].mailchimpList));
            }
        }
        updatePromises.push(mailchimpSync.createContacts(activists));
    });
    return Promise.all(updatePromises);
};
/**
 * @param activists
 * @param scan
 * determines for each activist whether or not they've already existed in the system
 * @returns {Promise<any[]>} - once resolved, the promise returns an object with two keys: nonDuplicates, and duplicates
 * each containing an array of activists
 */
const checkForDuplicates = function (activists){
    return new Promise((resolve)=> {
        //get sets of phones and emails from the activists
        const phones = activists.map((a) => {
            return a.profile.phone.replace(/[\-.():]/g, '')
        }).filter(phone => phone && phone.length > 3);
        const emails = activists.map((a) => {
            return a.profile.email.toLowerCase()
        }).filter(email => email && email.length > 3);
        let oldActivists = [];
        let newActivists = [];
        //fetch all pre-existing activists whose email/phone is included in the emails/phones lists
        const duplicates = activistsFetcher.searchDuplicates(phones, emails).then(duplicates => {
            //index those existing activists once by phone, and once by email
            //re-filtering is important in case some activists have an email address but no phone number
            const duplicatesWithPhones = duplicates.filter((d)=>(d.phone&&d.phone.length>3));
            const duplicatesByPhone = arrayFunctions.indexByField(duplicatesWithPhones, "phone");
            const duplicatesWithEmail = duplicates.filter((d)=>(d.email&&d.email.length>3));
            const duplicatesByEmail = arrayFunctions.indexByField(duplicatesWithEmail, "email");
            for (let i = 0; i < activists.length; i++) {
                //select an activist out of the newly typed activists
                let curr = activists[i];
                //if the activist's phone/email is a duplicate of an existing phone/email, this should point to the existing activist row
                let duplicateOf = duplicatesByPhone[curr.profile.phone] || duplicatesByEmail[curr.profile.email];
                if (duplicateOf) {
                    curr._id = duplicateOf._id;
                    curr.isDuplicate = true;
                    oldActivists.push(curr);
                } else {
                    curr.isDuplicate = false;
                    newActivists.push(curr);
                }
            }
            resolve({nonDuplicates: newActivists, duplicates: oldActivists});
        });
        return duplicates;
    });
};
/**
 * @param typedRows - an array containing all the data that has been typed in by the typer for some contacts scan
 * @param scanId - the corresponding scan id
 * @param markedDone - whether or not the typer has indicated that they've finished typing in all the rows in the scan
 * given data from the Typers page, inserts/updates the data into the db
 * @returns {Promise<any>} - once resolved, the promise returns true, or an {error: ...} object
 */
const uploadTypedActivists = async function (typedRows, scanId, markedDone) {
    //gets the _id of the activist who has made the request
    const typerId = Authentication.getMyId();
    const scan = await contactScanFetcher.getContactScanById(scanId);
    //rows that don't have an id attached
    //this means they have only just been input by the typer (as opposed to edited retroactively)
    let newRows = [];
    //rows which have already been typed and submitted as part of this specific scan page,
    //and have subsequently been updated by some typer
    let updatedRows = [];
    //current date. redundant comment.
    const today = new Date();
    for (let i = 0; i < typedRows.length; i++) {
        let curr = typedRows[i];
        //if the row doesn't contain an _id field add them to a list of rows to insert
        if (!curr._id) {
            newRows.push(
                {
                    "_id": mongoose.Types.ObjectId(),
                    "metadata": {
                        "creationDate": today,
                        "lastUpdate": today,
                        "joiningMethod": "contactPage",
                        "typerId": typerId,
                        "scanId": scanId,
                        "scanRow": curr.scanRow
                    },
                    "profile": {
                        "firstName": curr.firstName,
                        "lastName": curr.lastName,
                        "phone": curr.phone.replace(/[\-.():]/g, ''),
                        "email": curr.email.toLowerCase(),
                        "residency": curr.residency,
                        "comments": curr.comments,
                        "circle": "",
                        "isMember": false,
                        "isPaying": false,
                        "isNewsletter": "not subscribed",
                        "participatedEvents": [scan.eventId]
                    },
                    "role": {
                        "isTyper": false,
                        "isCaller": false,
                        "isOrganizer": false,
                        "isCircleLeader": false
                    },
                    "login": {
                        "loginCode": null,
                        "token": []
                    },
                    "pos": i
                });
        }
        //otherwise, add them to a list of rows to update
        else {
            if (!curr.locked) {
                updatedRows.push(curr);
            }
        }
    }
    //return a promise that resolves once all the db changes have been completed
    return new Promise((resolve) => {
        //update activists whose rows were previously submitted as part of this scan, and subsequently edited
        //we can assume that all these activists are already in the system
        updateTypedActivists(updatedRows).then(() => {
            //from here on out, we work only on newly typed rows
            //mark activists whose phones or emails are already stored in the system
            checkForDuplicates(newRows).then((result) => {
                //an array of completely new activists
                let nonDuplicates = result.nonDuplicates;
                //an array of activists whose details have just been typed in, but already existed in the system
                const duplicates = result.duplicates;
                //update the nonDuplicates array with circle data, determined for each activist based on their residency
                determineActivistsCircles(nonDuplicates).then(result => {
                    nonDuplicates = result;
                    let tasks = [];
                    //update metadata on preexisting activists (+ add the current event to their list of participatedEvents)
                    tasks.push(updateDuplicateActivists(duplicates, scan.eventId));
                    //insert the new activists into
                    tasks.push(Activist.insertMany(nonDuplicates));
                    //create a mailchimp record in the main contact list
                    tasks.push(mailchimpSync.createContacts(nonDuplicates));
                    //create a mailchimp record in the circle-specific contact list
                    tasks.push(addToRegionalMailchimpCircle(nonDuplicates));
                    //update the contact scan to contain data on the typed activists
                    //mark the activist as typed in the relevant contact scan
                    let activistRows = duplicates.map((a) => {
                        return {
                            _id: a._id,
                            new: false,
                            pos: a.pos,
                            comments: a.profile.comments
                        };
                    }).concat(nonDuplicates.map((a) => {
                        return {
                            _id: a._id,
                            new: true,
                            pos: a.pos,
                            comments: a.profile.comments
                        };
                    })).concat(updatedRows.map((a) => {
                        return {
                            _id: a._id,
                            comments: a.comments,
                        };
                    }));
                    tasks.push(markTypedContactScanRows(typerId, scanId, activistRows, markedDone));
                    return Promise.all(tasks).then((results) => {
                        resolve(results);
                    })
                });
            });
        });
    });
};

module.exports = {
    uploadTypedActivists,
    updateActivists
};