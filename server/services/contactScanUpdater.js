const mongoose = require('mongoose');
const Authentication = require('../services/authentication');
const ContactScan = require('../models/contactScanModel');
const ActivitUpdater = require('./activistUpdater');

const insertContactScan = function(scanUrl, eventId){
  const today = new Date();
   const scanObject={
       "_id": mongoose.Types.ObjectId(),
       "metadata":{
           "creationDate": today,
           "lastUpdate": today,
           "creatorId": Authentication.getMyId()
       },
       "scanUrl": scanUrl,
       "eventId": eventId
   };
   const newScan = new ContactScan(scanObject);
   return ContactScan.create(scanObject).then(()=>{
       return {"id": scanObject._id};
   });
};
const pingScan = function(scanId){
    scanId = mongoose.Types.ObjectId(scanId);
    const now = new Date();
    const query = ContactScan.update(
        {"_id": scanId},
        {"$set": {"lastPing": now}});
    return query.exec().then(
        (err, result) => {
            return {"err":err, "result":result};
        });
};
const importContacts = function(eventId, activists){
    return new Promise((resolve, reject)=> {
        insertContactScan("fromCSV", eventId).then((res) => {
            if (res.err)
                resolve({"err": res.err});
            const scanId = res.id;
            ActivitUpdater.uploadTypedActivists(activists, scanId, true).then((result) => {
                resolve(result);
            });
        })
    })
};
module.exports = {
    insertContactScan,
    pingScan,
    importContacts
};

