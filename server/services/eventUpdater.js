const Authentication = require('../services/authentication');
const Activist = require('../models/activistModel');
const Event = require('../models/eventModel');

const insertEvent = function(req, res){
    Authentication.hasRole(req, res, "isOrganizer").then(isUser=>{
        if(!isUser)
            return res.json({"error":"missing token"});
        var eventObject = req.body.event;
        var today = new Date();
        eventObject.metadata={
            "creationDate": today,
            "lastUpdate": today,
            "creatorId": Authentication.getMyId()
        };
        var schedule = eventObject.eventDetails.date.split("/");
        eventObject.eventDetails.date = new Date(schedule[2], schedule[1] - 1, schedule[0]);
        var newEvent = new Event(eventObject);
        newEvent.save(function (err) {
            if (err){
                return res.json(err);
            }
            else
                return res.json(req.body);
        });
    })
};
const inviteByQuery = function(req, res){
    Authentication.hasRole(req, res, "isOrganizer").then(isUser=>{
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
    insertEvent,
    inviteByQuery
};

