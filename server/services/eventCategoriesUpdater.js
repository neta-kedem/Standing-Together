const mongoose = require('mongoose');
const EventCategory = require('../models/eventCategoryModel');

const saveEventCategories = function(categories){
    let toInsert = [];
    let toUpdate = [];
    for (let i = 0; i< categories.length; i++){
        //the best part of have to program categories is having a good reason to name a variable 'cat'
        let cat = categories[i];
        if(cat._id)
            toUpdate.push(cat);
        else
            toInsert.push(cat);
    }
    const updatePromises = [insertCategories(toInsert), updateCategories(toUpdate)];
    return Promise.all(updatePromises);
};
const insertCategories = function(categories){
    if(!categories || !categories.length)
        return Promise.resolve(true);
    const query = EventCategory.insertMany(categories);
    return query;
};
const updateCategories = function(categories){
    let updatePromises = [];
    for(let i=0; i<categories.length; i++){
        const curr = categories[i];
        const query = EventCategory.updateOne({'_id': mongoose.Types.ObjectId(curr._id)}, curr);
        updatePromises.push(query.exec());
    }
    return Promise.all(updatePromises);
};
module.exports = {
    saveEventCategories
};

