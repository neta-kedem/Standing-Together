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
module.exports = {
    getCircles
};