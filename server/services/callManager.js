const mongoose = require('mongoose');
const Event = require('../models/eventModel');
const Activist = require('../models/activistModel');
const Authentication = require('../services/authentication');
const MongooseUpdater = require('../services/dbHelper/mongooseUpdater');
const arrayFunctions = require("../services/arrayFunctions");

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
const markFetchedActivists = function(eventId, assignedActivistsIds, callerId){
    if(!eventId)
        return false;
    const now = new Date();
    return MongooseUpdater._update(Event,
        {"_id": eventId},
        {
            "$set": {
                    "campaign.invitations.$[i].lastPing": now,
                    "campaign.invitations.$[i].callerId": mongoose.Types.ObjectId(callerId)
                }
            },
        [{"i.activistId":{$in : assignedActivistsIds}}],
        true
    );
};
const fetchActivistsToCall = function(req, res){
    Authentication.hasRole(req, "isCaller").then(result=>{
        if(result.error)
            return res.json({error: result.error});
        const eventId = mongoose.Types.ObjectId(req.params.eventId);
        const callerId = Authentication.getMyId();
        const bulkSize= 2;
        Event.findOne({"_id": eventId}, (err, eventData) => {
            if (err) return res.json({success: false, error: err});
            if (!eventData)
                return res.json({"error":"couldn't find a matching event"});
            if (!eventData.campaign||!eventData.campaign.invitations.length)
                return res.json({"message":"No Invites"});
            const now = new Date();
            const invitedActivists = eventData.campaign.invitations;
            //filter out any activists that have had their calls resolved
            const unresolvedInvitations = invitedActivists.filter(invite => !invite.resolution);
            if(!unresolvedInvitations.length)
            {
                return res.json({"message":"All Resolved"});
            }
            //filter out any activists that are reserved for another caller
            const reservationDeadline = new Date(now.getTime()-maxReservationDuration*60000);
            const unreservedInvitations = unresolvedInvitations.filter(invite => !invite.lastPing||invite.lastPing<reservationDeadline);
            if(!unreservedInvitations.length)
            {
                return res.json({"message":"All Processed"});
            }
            const sortedInvitations = unreservedInvitations.sort((a, b)=>{return sortCallsByPriority(a, b, callerId, now)});
            const assignedActivists = sortedInvitations.slice(0, Math.min(sortedInvitations.length, bulkSize));
            const assignedActivistsIds = assignedActivists.map((assigned)=>{
                return assigned["activistId"];
            });
            Activist.find({_id:{$in:assignedActivistsIds}}, (err, activists) => {
                if (err) return res.json({success: false, error: err});
                let activistsList = [];
                const invitationsById = arrayFunctions.indexByField(assignedActivists, "activistId");
                for(let activist of activists)
                {
                    activistsList.push({
                        "_id":activist._id,
                        "phone":activist.profile.phone,
                        "email":activist.profile.email,
                        "firstName":activist.profile.firstName,
                        "lastName":activist.profile.lastName,
                        "city":activist.profile.residency,
                        "lastEvent":activist.profile.participatedEvents[activist.profile.participatedEvents.length-1],
                        "availableAt":invitationsById[activist._id].availableAt,
                        "lastCallAt":invitationsById[activist._id].lastCallAt,
                        "callCount":invitationsById[activist._id].callCount
                    });
                }
                //this used to work, but arrayFilters doesn't have stable support yet in mongoose
                /*Event.update(
                    {"_id": eventId},
                    {"$set": {"campaign.invitations.$[element].lastPing": now}},
                    {"arrayFilters": [{"element.activistId":{$in:assignedActivistsIds}}], "multi": true },
                    (err, result) => {
                    }
                );*/
                const markFetchedQuery = markFetchedActivists(eventId, assignedActivistsIds, callerId);
                if(!markFetchedQuery){
                    return res.json({"error":"couldn't find a matching event"});
                }
                else{
                    markFetchedQuery.then(()=>{
                        res.json(activistsList);
                    }).catch((result, err)=>{
                        res.json({"result":result, "err":err});
                    });
                }
            });
        });
    })
};
const pingCalls =function(req, res){
    Authentication.hasRole(req, "isCaller").then(result=>{
        if(result.error)
            return res.json({error: result.error});
        const callerId = Authentication.getMyId();
        const eventId = mongoose.Types.ObjectId(req.body.eventId);
        const activistIds = req.body.activistIds.map(id=>mongoose.Types.ObjectId(id));
        markFetchedActivists(eventId, activistIds, callerId).then(()=>{
            return res.json(true);
        });
    });
};
const resolveCall = function(req, res){
    Authentication.hasRole(req, "isCaller").then(result=>{
        if(result.error)
            return res.json({error: result.error});
        const eventId = mongoose.Types.ObjectId(req.body.eventId);
        const activistId = mongoose.Types.ObjectId(req.body.activistId);
        const now = new Date();
        const resolution = {
            attendingEvent: req.body.attendingEvent,
            contributed: req.body.contributed
        };
        MongooseUpdater._update(Event,
            {"_id": eventId},
            {
                    "$set": {
                        "campaign.invitations.$[i].lastCallAt": now,
                        "campaign.invitations.$[i].resolution": resolution
                    },
                    "$inc": {"campaign.invitations.$[i].callCount": 1}
                },
            [{"i.activistId":activistId}],
            false
        ).then(()=>{
            res.json(true);
        });
    });
};
const postponeCall = function(req, res){
    Authentication.hasRole(req, "isCaller").then(result=>{
        if(result.error)
            return res.json({error: result.error});
        const eventId = mongoose.Types.ObjectId(req.body.eventId);
        const activistId = mongoose.Types.ObjectId(req.body.activistId);
        const now = new Date();
        const availableAt = req.body.availableAt.split(":");
        let availabilityDate = new Date();
        try {
            availabilityDate.setHours(availableAt[0], availableAt[1], 0, 0)
        }
        catch(err) {
            res.json({"error":"hour format not supported"});
        }
        MongooseUpdater._update(Event,
            {"_id": eventId},
            {"$set": {
                        "campaign.invitations.$[i].lastCallAt": now,
                        "campaign.invitations.$[i].availableAt": availabilityDate
                    },
                    "$inc": {"campaign.invitations.$[i].callCount": 1}
                },
            [{"i.activistId":activistId}],
            false
        ).then(()=>{
            res.json(true);
        });
    });
};
const markUnanswered = function(req, res){
    Authentication.hasRole(req, "isCaller").then(result=>{
        if(result.error)
            return res.json({error: result.error});
        const eventId = mongoose.Types.ObjectId(req.body.eventId);
        const activistId = mongoose.Types.ObjectId(req.body.activistId);
        const now = new Date();
        MongooseUpdater._update(Event,
            {"_id": eventId},
            {
                    "$set": {
                    "campaign.invitations.$[i].lastCallAt": now
                    },
                    "$inc": {"campaign.invitations.$[i].callCount": 1}
                 },
            [{"i.activistId":activistId}],
            false
        ).then(()=>{
            res.json(true);
        });
    });
};

module.exports = {
    fetchActivistsToCall,
    pingCalls,
    resolveCall,
    postponeCall,
    markUnanswered
};

