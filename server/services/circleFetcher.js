const mongoose = require('mongoose');
const Circle = require('../models/circleModel');
const getCircles = function (){
    const query = Circle.find();
    const circlesPromise = query.exec().then((circles) => {
        let circleList = [];
        for(let circle of circles)
        {
            circleList.push({
                "_id":circle._id,
                "name":circle.name,
                "mailchimpList":circle.mailchimpList
            });
        }
        return circleList;
    });
    return circlesPromise;
};
const getCircleById = function (circleId){
    const query = Circle.find({"_id":mongoose.ObjectId(circleId)});
    const circlePromise = query.exec().then((circles) => {
        if(circles && circles.length){
            return {
                "_id": circles[0]._id,
                "name": circles[0].name,
                "mailchimpList": circles[0].mailchimpList
            };
        }
        else{
            return null;
        }
    });
    return circlePromise;
};
module.exports = {
    getCircles,
    getCircleById
};