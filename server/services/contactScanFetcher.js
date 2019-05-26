const mongoose = require("mongoose");
const ArrayFunctions = require("../services/arrayFunctions");
const Authentication = require('../services/authentication');
const EventFetcher = require('../services/eventFetcher');
const ContactScan = require('../models/contactScanModel');
const Activist = require('../models/activistModel');

//constants
//how much time (in minutes) after the last ping should an scanned sheet be reserved for the typer assigned to it.
const maxReservationDuration = 3;

const getAssociatedActivists = function(scanData){
    const activistIds = scanData.activists.map((a)=>{return mongoose.Types.ObjectId(a.activistId)});
    const query = Activist.find({"_id": {$in: activistIds}});
    const fetchPromise = query.exec().then((activists) => {
        let activistsList = [];
        const scanDataDict = ArrayFunctions.indexByField(scanData.activists, "activistId");
        for(let i=0; i<activists.length; i++)
        {
            let activist = activists[i];
            activistsList.push({
                "_id" : activist._id,
                "phone" : activist.profile.phone,
                "email" : activist.profile.email,
                "firstName" : activist.profile.firstName,
                "lastName" : activist.profile.lastName,
                "residency" : activist.profile.residency,
                "scanRow" : scanDataDict[activist._id].pos,
                "comments" : scanDataDict[activist._id].comments,
            });
        }
        return activistsList;
    });
    return fetchPromise;
};

const getContactScan = function(req, res){
    Authentication.hasRole(req, res, "isTyper").then(isUser=>{
        if(!isUser)
            return res.json({"error":"missing token"});
        const requestedId = req.query.scanId;
        const typerId = Authentication.getMyId();
        const now = new Date();
        const reservationDeadline = new Date(now.getTime() - maxReservationDuration*60000);
        let query = {};
        if(requestedId && requestedId.length){
            try{
                query = {"_id": mongoose.Types.ObjectId(requestedId)}
            }
            catch{
                return res.json({success: false, error: "incorrect id supplied"});
            }
        }
        else{
            query = {"complete": false, $or:[{"lastPing":null}, {"lastPing":{$lt: reservationDeadline}}, {"typerId": typerId}]};
        }
        ContactScan.findOneAndUpdate(
            query,
            {"$set": {"lastPing": now, "typerId": typerId}},
            (err, scanData) => {
                if (err) return res.json({success: false, error: err});
                if (!scanData)
                    return res.json({"error":"no pending scans are available"});
                let returnData = {scanData: scanData};
                getAssociatedActivists(scanData).then(activists=>{
                    returnData.activists = activists;
                    EventFetcher.getEventById(scanData.eventId).then(eventData=>{
                        returnData.eventData = eventData;
                        return res.json(returnData);
                    });
                })
            });
    })
};
const getById = function(scanId){
    let scanObjectId;
    try{
        scanObjectId = mongoose.Types.ObjectId(scanId);
    }
    catch{
        return {error: "incorrect id supplied"};
    }
    const query = ContactScan.findOne({"_id": scanObjectId});
    const promise = query.exec().then((res)=>{
        if (!res || !res._id)
            return {"error":"couldn't find a matching scan"};
        return res;
    }).catch((err)=>{
        return {success: false, error: err};
    });
    return promise;
};
const getByActivistId = function(activistId){
    const query = ContactScan.find({"activists.activistId": activistId});
    return query.exec().then(results=>{
        return results;
    });
};

module.exports = {
    getContactScan,
    getById,
    getByActivistId
};

