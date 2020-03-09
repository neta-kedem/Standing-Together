const mongoose = require('mongoose');
const Activist = require('../models/activistModel');
const City = require('../models/cityModel');
const ContactScan = require('../models/contactScanModel');
const Event = require('../models/eventModel');


const idifyParticipatedEvents = function(){
    console.log("casting the eventId field (in participated events) of activist objects to ObjectId");
    const bulk = Activist.collection.initializeOrderedBulkOp();
    Activist.find({}).then(activists=>{
        for(let i = 0; i< activists.length; i++){
            let a = activists[i];
            if(a.profile.participatedEvents && a.profile.participatedEvents.length){
                let idified = a.profile.participatedEvents.map(e=>{
                    if(typeof e === "string")
                        return mongoose.Types.ObjectId(e);
                    return e;
                });
                bulk.find({_id: a._id}).updateOne({$set:{"profile.participatedEvents": idified}});
            }
        }
        return bulk.execute().then(res=>{
            console.log(res)
        });
    });
};

const getParticipatedEventsFromScans = function(){
    console.log("update the list of events activists have participated in based on references to them in contact scans");
    const bulk = Activist.collection.initializeOrderedBulkOp();
    const activistDict = {};
    ContactScan.find({}).then(scans=>{
        for(let i = 0; i< scans.length; i++) {
            let s = scans[i];
            if (!s.activists)
                continue;
            for (let j = 0; j < s.activists.length; j++) {
                let a = s.activists[j];
                if (!activistDict[a.activistId])
                    activistDict[a.activistId] = [];
                activistDict[a.activistId].push(s.eventId);
            }
        }
        const activists = Object.keys(activistDict);
        for(let i = 0; i < activists.length; i++){
            bulk.find({_id: mongoose.Types.ObjectId(activists[i])}).updateOne({$set:{"profile.participatedEvents": activistDict[activists[i]]}});
        }
        return bulk.execute().then(res=>{
            console.log(res)
        });
    });
};
const idifyContactScans = function(){
    console.log("casting the creatorId, typerId, and eventId fields of contactScan objects to ObjectId");
    const bulk = ContactScan.collection.initializeOrderedBulkOp();
    return ContactScan.find({}).then(scans=>{
        for(let i = 0; i< scans.length; i++){
            let s = scans[i];
            let creatorId = s.metadata.creatorId;
            let typerId = s.typerId;
            let eventId = s.eventId;
            if(typeof creatorId === "string")
                creatorId = mongoose.Types.ObjectId(creatorId);
            if(typeof typerId === "string")
                typerId = mongoose.Types.ObjectId(typerId);
            if(typeof eventId === "string")
                eventId = mongoose.Types.ObjectId(eventId);
            let activists = s.activists;
            if(activists){
                activists = s.activists.map(a=>{
                    if(typeof a.activistId === "string")
                        a.activistId = mongoose.Types.ObjectId(a.activistId);
                    if(typeof a.typerId === "string")
                        a.typerId = mongoose.Types.ObjectId(a.typerId);
                    return a;
                });
            }
            bulk.find({_id: s._id}).updateOne({$set:{
                "metadata.creatorId": creatorId,
                "typerId": typerId,
                "eventId": eventId,
                "activists": activists,
            }});
        }
        return bulk.execute().then(res=>{
            console.log(res)
        });
    });
};
const idifyEvents = function(){
    console.log("casting the creatorId and category fields of event objects to ObjectId");
    const bulk = Event.collection.initializeOrderedBulkOp();
    return Event.find({}).then(events=>{
        for(let i = 0; i< events.length; i++){
            let e = events[i];
            let creatorId = e.metadata.creatorId;
            let category = e.eventDetails.category;
            if(typeof creatorId === "string")
                creatorId = mongoose.Types.ObjectId(creatorId);
            if(typeof category === "string")
                category = mongoose.Types.ObjectId(category);
            bulk.find({_id: e._id}).updateOne({$set:{
                    "metadata.creatorId": creatorId,
                    "eventDetails.category": category,
                }});
        }
        return bulk.execute().then(res=>{
            console.log(res)
        });
    });
};

const removeFictitiousPhones = function(){
    console.log("removing phones containing the string 'fic'");
    Activist.updateMany({"profile.phone":{"$regex":"fic"}}, {$set:{"profile.phone":""}}).exec();
};

const castMemberJoinDate = function(){
    console.log("casting the joining date field of members to Date");
    const bulk = Activist.collection.initializeOrderedBulkOp();
    Activist.find({}).then(activists=>{
        for(let i = 0; i< activists.length; i++){
            let a = activists[i];
            if(a.membership && typeof a.membership.joiningDate === "string"){
                let date = null;
                if(a.membership.joiningDate.length){
                    date = new Date(Date.parse(a.membership.joiningDate));
                }
                else{
                    date = new Date(Date.parse("01/01/2017"));
                }
                bulk.find({_id: a._id}).updateOne({$set:{"membership.joiningDate": date}});
            }
        }
        return bulk.execute().then(res=>{
            console.log(res)
        });
    });
};

const setCirclesByCity = function(){
    const bulk = Activist.collection.initializeOrderedBulkOp();
    City.find({}).then(cities=>{
        for(let i = 0; i < cities.length; i++){
            let c = cities[i];
            if(c.defaultCircle && c.name.he && c.name.he.length){
                bulk.find({
                    $and: [
                        {"profile.residency": c.name.he},
                        {
                            $or: [
                                {"profile.circle": ""},
                                {"profile.circle": {$exists:false}},
                            ]
                        },
                    ]}).update({$set:{"profile.circle": c.defaultCircle}});
            }
        }
        return bulk.execute().then(res=>{
            console.log(res)
        });
    });
};

const fix = async function(){
    await setCirclesByCity();
};

module.exports = {
    fix
};