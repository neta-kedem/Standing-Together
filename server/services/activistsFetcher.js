const Activist = require('../models/activistModel');
const mongoose = require('mongoose');
const Authentication = require('./authentication');
const EventFetcher = require("./eventFetcher");
const contactScanFetcher = require("./contactScanFetcher");
const getActivists = function (req, res){
    Authentication.isUser(req, res).then(isUser=>{
        if(!isUser)
            return res.json({"error":"missing token"});
        Activist.find((err, activists) => {
            if (err) return res.json({success: false, error: err});
            let activistsList = [];
            for(let activist of activists)
            {
                activistsList.push({
                    "_id":activist._id,
                    "phone":activist.profile.phone,
                    "email":activist.profile.email,
                    "name":activist.profile.firstName+" "+activist.profile.lastName,
                    "city":activist.profile.residency,
                    "isCaller":activist.role.isCaller,
                    "lastEvent":activist.profile.participatedEvents[activist.profile.participatedEvents.length-1]
                });
            }
            return res.json(activistsList);
        });
    })
};
const getActivistsByIds = function (ids){
    const query = Activist.find({"_id":{$in: ids.map((id)=>{return mongoose.Types.ObjectId(id)})}});
    const activistsPromise = query.exec().then((activists) => {
        // this array holds promises to queries fetching information about events and contact scans relevant to the activists
        const additionalDataPromises = [];
        for(let i = 0; i < activists.length; i++){
            const a = activists[i];
            if(a.profile.participatedEvents && a.profile.participatedEvents.length){
                const getEvents = EventFetcher.getEventsByIds(a.profile.participatedEvents).then(events=>{
                    a.profile.participatedEvents = events.map((event)=>{return {
                        _id: event._id, date: event.eventDetails.date, location: event.eventDetails.location
                    }});
                    console.log(a.profile.participatedEvents);
                });
                additionalDataPromises.push(getEvents);
            }
            /*const getScans = contactScanFetcher.getByActivistId(a._id).then((scans) => {
                a.profile.scans = scans.map((scan)=>{return {_id:scan._id, url:scan.scanUrl}});
                console.log("console.log(Object.keys(a.profile));");
                console.log(Object.keys(a.profile));
                console.log("console.log(JSON.stringify(a.profile))");
                console.log(JSON.stringify(a.profile));
                console.log(typeof a.profile.scans);
            });
            additionalDataPromises.push(getScans);*/
        }
        return Promise.all(additionalDataPromises).then(() => {
            return activists;
        })
    });
    return activistsPromise;
};
const queryActivists = function(query, page, callback){
    try{
      query = JSON.parse(query);
    }
    catch(err){
      console.log(err);
    }
    if(page < 0)
        return callback({"error":"illegal page"});
    const PAGE_SIZE = 50;
    return Activist.paginate(query, { page: page + 1, limit: PAGE_SIZE }).then((result) => {
        const activists = result.docs;
        let activistsList = [];
        for(let activist of activists)
        {
            activistsList.push({
                "_id":activist._id,
                "phone":activist.profile.phone,
                "email":activist.profile.email,
                "name":activist.profile.firstName+" "+activist.profile.lastName,
                "city":activist.profile.residency,
                "isCaller":activist.role.isCaller,
                "lastEvent":activist.profile.participatedEvents[activist.profile.participatedEvents.length-1]
            });
        }
        return callback({activists: activistsList, pageCount: result.pages, activistCount: result.total});
    });
};
const downloadActivistsByQuery = function(query, callback){
    try{
      query = JSON.parse(query);
    }
    catch(err){
      console.log(err);
    }
    return Activist.find(query).then((activists) => {
        let activistsList = [];
        for(let activist of activists)
        {
            activistsList.push({
                "phone":activist.profile.phone,
                "email":activist.profile.email,
                "firstName":activist.profile.firstName,
                "lastName":activist.profile.lastName,
                "city":activist.profile.residency,
                "isCaller":activist.role.isCaller,
                "creationDate":activist.metadata.creationDate,
                "circle":activist.profile.circle,
                "isMember": activist.profile.isMember,
                "isPaying": activist.profile.isPaying,
                "isNewsletter": activist.profile.isNewsletter
            });
        }
        return callback({activists: activistsList});
    });
};
const searchDuplicates = function(phones, emails){
    const query =  Activist.find({$or: [{"profile.phone":{$in:phones}}, {"profile.email":{$in:emails}}]});
    const duplicatesPromise = query.exec().then((activists) => {
        let activistsList = [];
        for(let activist of activists)
        {
            activistsList.push({
                "_id":activist._id,
                "phone":activist.profile.phone,
                "email":activist.profile.email
            });
        }
        return activistsList;
    });
    return duplicatesPromise;
};
module.exports = {
    getActivists,
    queryActivists,
    searchDuplicates,
    getActivistsByIds,
    downloadActivistsByQuery
};