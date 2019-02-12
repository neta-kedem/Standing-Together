const mongoose = require('mongoose');
const Event = require('../models/eventModel');
const Activist = require('../models/activistModel');
const Authentication = require('../services/authentication');

//constants
//how much time (in minutes) after the last ping should an activist be reserved for the caller assigned to it.
const maxReservationDuration = 3;
const sortCallsByPriority = function(a, b, callerId, now){
    let weightA = 0;
    let weightB = 0;
    //if the activist has been assigned previously (in this campaign) to this caller give them a higher ranking
    if(a.callerId===callerId)
        weightA += 2;
    if(b.callerId===callerId)
        weightB += 2;
    //if the activist has asked to be called at a later time
    if(a.availableAt)
    {
        if(a.availableAt<now)
            weightA += 3;
        else
            weightA -= 4;
    }
    //if the activist has asked to be called at a later time
    if(b.availableAt)
    {
        if(b.availableAt<now)
            weightB += 3;
        else
            weightB -= 4;
    }
    //introduce bias toward calling people who weren't called lately
    if((b.lastCallAt?0:b.lastCallAt)>(a.lastCallAt?0:a.lastCallAt))
    {
        weightA += 1;
    }
    if((b.lastCallAt?0:b.lastCallAt)<(a.lastCallAt?0:a.lastCallAt))
    {
        weightB += 1;
    }
    return weightB - weightA;
};
const fetchActivistsToCall = function(req, res){
    Authentication.hasRole(req, res, "isCaller").then(isUser=>{
        if(!isUser)
            return res.json({"error":"missing token"});
        const eventId = mongoose.Types.ObjectId(req.body.eventId);
        const callerId = Authentication.getMyId();
        const bulkSize= 2;
        Event.findOne({"_id": eventId}, (err, eventData) => {
            if (err) return res.json({success: false, error: err});
            if (!eventData)
                return res.json({"error":"couldn't find a matching event"});
            if (!eventData.campaign&&!eventData.campaign.invitations.length)
                return res.json({"error":"couldn't find any invited activists"});
            const now = new Date();
            const invitedActivists = eventData.campaign.invitations;
            //filter out any activists that have had their calls resolved
            const unresolvedInvitations = invitedActivists.filter(invite => !invite.resolution);
            if(!unresolvedInvitations.length)
            {
                return res.json({"message":"All invitations have been resolved!"});
            }
            //filter out any activists that are reserved for another caller
            const reservationDeadline = new Date(now.getTime()-maxReservationDuration*60000);
            const unreservedInvitations = unresolvedInvitations.filter(invite => !invite.lastPing||invite.lastPing<reservationDeadline);
            if(!unreservedInvitations.length)
            {
                return res.json({"message":"All invitations are already being processed!"});
            }
            const sortedInvitations = unreservedInvitations.sort((a, b)=>{return sortCallsByPriority(a, b, callerId, now)});
            const assignedActivists = sortedInvitations.slice(0, Math.min(sortedInvitations.length, bulkSize));
            const assignedActivistsIds = assignedActivists.map(function(value) {return value["activistId"];});
            Event.update(
                {"_id": eventId},
                {"$set": {"campaign.invitations.$[elem].lastPing": now}},
                {"arrayFilters": [{"elem.activistId":{$in:assignedActivistsIds}}], "multi": true },
                (err, result) => {
                }
            );
            Activist.find({_id:{$in:assignedActivistsIds}}, (err, activists) => {
                if (err) return res.json({success: false, error: err});
                activistsList = [];
                for(let activist of activists)
                {
                    activistsList.push({
                        "_id":activist._id,
                        "phone":activist.profile.phone,
                        "email":activist.profile.email,
                        "firstName":activist.profile.firstName,
                        "lastName":activist.profile.lastName,
                        "city":activist.profile.residency,
                        "lastEvent":activist.profile.participatedEvents[activist.profile.participatedEvents.length-1]
                    });
                }
                return res.json(activistsList);
            });
        });
    })
};
const pingCalls =function(req, res){
    Authentication.hasRole(req, res, "isCaller").then(isUser=>{
        if(!isUser)
            return res.json({"error":"missing token"});
        const eventId = mongoose.Types.ObjectId(req.body.eventId);
        const activistIds = req.body.activistIds.map(id=>mongoose.Types.ObjectId(id));
        const now = new Date();
        Event.update(
            {"_id": eventId},
            {"$set": {"campaign.invitations.$[elem].lastPing": now}},
            {"arrayFilters": [{"elem.activistId":{$in:activistIds}}], "multi": true },
            (err, result) => {
                return res.json({"err":err, "result":result});
            }
        );
    });
};
const resolveCall = function(req, res){
    Authentication.hasRole(req, res, "isCaller").then(isUser=>{
        if(!isUser)
            return res.json({"error":"missing token"});
        const eventId = mongoose.Types.ObjectId(req.body.eventId);
        const activistId = mongoose.Types.ObjectId(req.body.activistId);
        const now = new Date();
        const resolution = {
            attendingEvent: req.body.attendingEvent,
            contributed: req.body.contributed
        };
        Event.update(
            {"_id": eventId},
            {
                "$set": {
                    "campaign.invitations.$[i].lastCallAt": now,
                    "campaign.invitations.$[i].resolution": resolution
                }
            },
            {"arrayFilters": [{"i.activistId":activistId}], "multi": false},
            (err, result) => {
                return res.json({"err":err, "result":result});
            }
        );
    });
};
const postponeCall = function(req, res){
    Authentication.hasRole(req, res, "isCaller").then(isUser=>{
        if(!isUser)
            return res.json({"error":"missing token"});
        const eventId = mongoose.Types.ObjectId(req.body.eventId);
        const activistId = mongoose.Types.ObjectId(req.body.activistId);
        const now = new Date();
        const availableAt = req.body.availableAt;
        Event.update(
            {"_id": eventId},
            {
                "$set": {
                    "campaign.invitations.$[elem].lastCallAt": now,
                    "campaign.invitations.$[elem].availableAt": availableAt
                }
            },
            {"arrayFilters": [{"elem.activistId":activistId}], "multi": true},
            (err, result) => {
                return res.json({"err":err, "result":result});
            }
        );
    });
};

module.exports = {
    fetchActivistsToCall,
    pingCalls,
    resolveCall,
    postponeCall
};

