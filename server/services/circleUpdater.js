const mongoose = require('mongoose');
const Circle = require('../models/circleModel');

const saveCircles = function(circles){
    let toInsert = [];
    let toUpdate = [];
    for (let i = 0; i< circles.length; i++){
        let circle = circles[i];
        if(circle._id)
            toUpdate.push(circle);
        else
            toInsert.push(circle);
    }
    const updatePromises = [insertCircles(toInsert), updateCircles(toUpdate)];
    return Promise.all(updatePromises);
};
const insertCircles = function(circles){
    const today = new Date();
    const circlesObject = circles.map((c)=>{
        return {name: c.name, mailchimpList: c.mailchimpList, metadata:{"creationDate": today, "lastUpdate": today}};
    });
    const query = Circle.insertMany(circlesObject);
    return query;
};
const updateCircles = function(circles){
    const today = new Date();
    let updatePromises = [];
    for(let i=0; i<circles.length; i++){
        const curr = circles[i];
        const query = Circle.updateOne({'_id': mongoose.Types.ObjectId(curr._id)}, {
            "name" : curr.name,
            "mailchimpList" : curr.mailchimpList,
            "metadata.lastUpdate": today
        });
        updatePromises.push(query.exec());
    }
    return Promise.all(updatePromises);
};
module.exports = {
    saveCircles
};

