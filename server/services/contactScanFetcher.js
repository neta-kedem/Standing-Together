const mongoose = require("mongoose")
const ArrayFunctions = require("../services/arrayFunctions");
const Authentication = require('../services/authentication');
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
        const typerId = Authentication.getMyId();
        const now = new Date();
        const reservationDeadline = new Date(now.getTime() - maxReservationDuration*60000);
        ContactScan.findOneAndUpdate(
            {"complete": false, $or:[{"lastPing":null}, {"lastPing":{$lt: reservationDeadline}}, {"typerId": typerId}]},
            {"$set": {"lastPing": now, "typerId": typerId}},
            (err, scanData) => {
                if (err) return res.json({success: false, error: err});
                if (!scanData)
                    return res.json({"error":"no pending scans are available"});
                getAssociatedActivists(scanData).then(activists=>{
                    return res.json({scanData: scanData, activists: activists});
                })
            });
    })
};

module.exports = {
    getContactScan
};

