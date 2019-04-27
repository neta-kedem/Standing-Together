const mongoose = require('mongoose');
const Authentication = require('../services/authentication');
const Event = require('../models/eventModel');

//used internally by other server-side functions
const getEventsByIds = function (ids){
    const query = Event.find({"_id":{$in: ids.map((id)=>{return mongoose.Types.ObjectId(id)})}});
    const eventsPromise = query.exec().then((events) => {
        return events
    });
    return eventsPromise;
};
//used externally by API
const getEventById = function(eventId){
    try {
        mongoose.Types.ObjectId(eventId);
    }
    catch(err) {
        return {success: false, error: "invalid event id"};
    }
    const eventIdObject = mongoose.Types.ObjectId(eventId);
    const query = Event.findOne({"_id": eventIdObject});
    const promise = query.exec().then((res)=>{
        if (!res || !res._id)
            return {"error":"couldn't find a matching event"};
        return {
            "_id":res._id,
            "eventDetails":res.eventDetails,
            "callInstructions":res.callInstructions
        };
    }).catch((err)=>{
        return {success: false, error: err};
    });
    return promise;
};
const getEventByCode = function(req, res){
    Authentication.hasRole(req, res, "isOrganizer").then(isUser=>{
        if(!isUser)
            return res.json({"error":"missing token"});
        const eventCode = req.params.code;
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
    Authentication.hasRole(req, res, "isTyper").then(isUser=>{
        if(!isUser)
            return res.json({"error" : "missing token"});
        const page = req.body.page;
        if(page < 0)
            return res.json({"error":"illegal page"});
        const PAGE_SIZE = 15;
        Event.paginate({}, {sort: {"metadata.creationDate": -1}, page: page + 1, limit: PAGE_SIZE }).then((result) => {
            const events = result.docs.map((event)=>{
                return {
                    _id: event._id,
                    creationDate: event.metadata.creationDate,
                    name: event.eventDetails.name,
                    date: event.eventDetails.date,
                    location: event.eventDetails.location,
                    campaign: !!event.campaign,
                    campaignUrl: !!event.campaign?event.campaign.eventCode:null
                };
            });
            return res.json({"events": events, "pageCount": result.pages, "eventCount": result.total});
        });
    })
};

module.exports = {
    getEventById,
    getEventByCode,
    getCampaignLess,
    listEvents,
    getEventsByIds
};

