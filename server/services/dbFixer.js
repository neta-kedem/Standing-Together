const mongoose = require('mongoose');
const Activist = require('../models/activistModel');
const City = require('../models/cityModel');
const Circle = require('../models/circleModel');
const EventCategory = require('../models/eventCategoryModel');
const ContactScan = require('../models/contactScanModel');
const Event = require('../models/eventModel');


const idifyAll =  function(){
    //const models = [Activist, Circle, City, EventCategory, ContactScan, Event];
    const models = [{"m": ContactScan, "c":"contactscans"}];
    console.log("****************************************");
    models.forEach((t)=>{
        let bulk = mongoose.connection.db.collection(t.c+'Duplicate').initializeUnorderedBulkOp();
        t.m.find({}).then(results=>{
            for(let i = 0; i < results.length; i++){
                let a = results[i];
                try {
                    a._id = mongoose.Types.ObjectId(a._id);
                }
                catch(err){
                    console.log(a._id);
                }
                bulk.insert(a);
            }
            return bulk.execute().then(res=>{
                console.log(`idifyAll:`);
                console.log(JSON.stringify(res));
            }).catch(err=>{
                console.log(err);
            });
        })
    })
};

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
            console.log(`idifyParticipatedEvents ${res}`)
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
            console.log(`getParticipatedEventsFromScans ${res}`)
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
            console.log(`idifyContactScans ${res}`)
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
            console.log(`idifyEvents ${res}`)
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
            console.log(`castMemberJoinDate ${res}`)
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
    await idifyParticipatedEvents();
    await idifyContactScans();
    await idifyEvents();
};

module.exports = {
    fix
};
