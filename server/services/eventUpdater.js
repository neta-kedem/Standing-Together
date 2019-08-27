const mongoose = require('mongoose');
const Authentication = require('../services/authentication');
const Activist = require('../models/activistModel');
const Event = require('../models/eventModel');

const saveEvent = function(req, res){
    Authentication.hasRole(req, "isOrganizer").then(isUser=>{
        if(!isUser)
            return res.json({"error":"missing token"});
        if(req.body.event._id){
            updateEvent(req, res);
        }
        else{
            insertEvent(req, res);
        }
    })
};
const insertEvent = function(req, res){
    Authentication.hasRole(req, "isOrganizer").then(isUser=>{
        if(!isUser)
            return res.json({"error":"missing token"});
        const eventObject = req.body.event;
        const today = new Date();
        eventObject.metadata={
            "creationDate": today,
            "lastUpdate": today,
            "creatorId": Authentication.getMyId()
        };
        if(eventObject.category)
            eventObject.category = mongoose.Types.ObjectId(eventObject.category);
        const schedule = eventObject.eventDetails.date.split(/[.,\/ -]/).map(val=>{return parseInt(val)});
        eventObject.eventDetails.date = new Date(schedule[2] < 2000 ? schedule[2] + 2000 : schedule[2], schedule[1] - 1, schedule[0]);
        const newEvent = new Event(eventObject);
        newEvent.save(function (err) {
            if (err){
                return res.json(err);
            }
            else
                return res.json(req.body);
        });
    })
};
const updateEvent = function(req, res){
    Authentication.hasRole(req, "isOrganizer").then(isUser=>{
        if(!isUser)
            return res.json({"error":"missing token"});
        const eventObject = req.body.event;
        const today = new Date();
        const schedule = eventObject.eventDetails.date.split("/");
        eventObject.eventDetails.date = new Date(schedule[2], schedule[1] - 1, schedule[0]);
        const newEvent = new Event(eventObject);
        /*for documentation on this approach to upserting, see: https://stackoverflow.com/a/7855281*/
        const upsertData = newEvent.toObject();
        delete upsertData._id;
        Event.updateOne({_id: newEvent._id}, {
            "metadata.lastUpdate": today,
            "eventDetails": upsertData.eventDetails,
            "callInstructions": upsertData.callInstructions,
        }, {upsert: true}, function (err) {
            if (err){
                return res.json(err);
            }
            else
                return res.json(req.body);
        });
    })
};
const inviteByQuery = function(req, res){
    Authentication.hasRole(req, "isOrganizer").then(isUser=>{
        if(!isUser)
            return res.json({"error":"missing token"});
        const query = req.body.query;
        const eventId = req.body.eventId;
        Activist.find(query, (err, activists) => {
            //extract the _id field from the results, into an non-associative array
            let invitedIds = activists.map(function(value) {return value["_id"];});
            let invitations = [];
            for (var i =0; i<invitedIds.length; i++)
            {
                invitations.push({
                    "activistId": invitedIds[i],
                    "lastCallAt": null,
                    "availableAt": null,
                    "isHandled": false,
                    "callerId": null
                });
            }
            //date of campaign creation
            let today = new Date();
            let campaignObject = {
                "metadata":{
                    "creationDate": today,
                    "lastUpdate": today,
                    "creatorId": Authentication.getMyId()
                },
                "selectionQuery": JSON.stringify(query),
                "eventCode": Math.random().toString(36).substr(2, 10),
                "invitations": invitations
            };
            Event.findOneAndUpdate({'_id':eventId}, {$set : {'campaign':campaignObject}}, (err) => {
                if (err) return res.json({success: false, error: err});
                return res.json({"eventCode":campaignObject.eventCode});
            });
        });
    })
};

module.exports = {
    saveEvent,
    inviteByQuery
};

