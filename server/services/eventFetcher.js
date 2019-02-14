const mongoose = require('mongoose');
const Authentication = require('../services/authentication');
const Event = require('../models/eventModel');

const getEventById = function(req, res){
    Authentication.hasRole(req, res, "isOrganizer").then(isUser=>{
        if(!isUser)
            return res.json({"error":"missing token"});
        try {
            mongoose.Types.ObjectId(req.params.id);
        }
        catch(err) {
            return res.json({success: false, error: "invalid event id"});
        }
        const eventId = mongoose.Types.ObjectId(req.params.id);
        Event.findOne({"_id": eventId}, (err, eventData) => {
            if (err) return res.json({success: false, error: err});
            if (!eventData)
                return res.json({"error":"couldn't find a matching event"});
            return res.json({
                "_id":eventData._id,
                "eventDetails":eventData.eventDetails,
                "callInstructions":eventData.callInstructions
            });
        });
    })
};
const getEventByCode = function(req, res){
    Authentication.hasRole(req, res, "isOrganizer").then(isUser=>{
        if(!isUser)
            return res.json({"error":"missing token"});
        const eventCode = req.body.eventCode;
        Event.findOne({"campaign.eventCode": eventCode}, (err, eventData) => {
            if (err) return res.json({success: false, error: err});
            if (!eventData)
                return res.json({"error":"couldn't find a matching event"});
            return res.json({
                "_id":eventData._id,
                "eventDetails":eventData.eventDetails,
                "callInstructions":eventData.callInstructions
            });
        });
    })
};
const getCampaignLess = function(req, res){
    Authentication.hasRole(req, res, "isOrganizer").then(isUser=>{
        if(!isUser)
            return res.json({"error":"missing token"});
        Event.find({"campaign" : {$exists:false}}, (err, events) => {
            if (err) return res.json({success: false, error: err});
            let eventList = [];
            for(let e of events)
            {
                eventList.push({
                    "_id":e._id,
                    "name":e.eventDetails.name,
                    "date":e.eventDetails.date
                });
            }
            return res.json(eventList);
        });
    })
};
const listEvents = function(req, res){
    //TODO move this constant elsewhere
    const pageSize = 15;
    Authentication.hasRole(req, res, "isOrganizer").then(isUser=>{
        if(!isUser)
            return res.json({"error" : "missing token"});
        Event.find({}).sort({"eventDetails.name": -1}).limit(pageSize).skip(req.page*pageSize).then((events) => {
            return res.json(events.map((event)=>{
                return {
                    _id: event._id,
                    creationDate: event.metadata.creationDate,
                    name: event.eventDetails.name,
                    date: event.eventDetails.date,
                    location: event.eventDetails.location,
                    campaign: !!event.campaign
                };
            }))
        });
    })
};

module.exports = {
    getEventById,
    getEventByCode,
    getCampaignLess,
    listEvents
};

