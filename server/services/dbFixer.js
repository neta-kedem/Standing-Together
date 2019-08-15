const mongoose = require('mongoose');
const Activist = require('../models/activistModel');

const idifyParticipatedEvents = function(){
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
                console.log(idified);
                console.log(`bulk.find({_id: ${a._id}}).updateOne({$set:{"profile.participatedEvents": ${idified}}});`);
                bulk.find({_id: a._id}).updateOne({$set:{"profile.participatedEvents": idified}});
            }
        }
        return bulk.execute().then(res=>{
            console.log(res)
        });
    });
};

module.exports = {
    idifyParticipatedEvents
};