const mongoose = require('mongoose');
const City = require('../models/cityModel');

const saveCities = function(cities){
    let toInsert = [];
    let toUpdate = [];
    for (let i = 0; i< cities.length; i++){
        let city = cities[i];
        if(city._id)
            toUpdate.push(city);
        else
            toInsert.push(city);
    }
    const updatePromises = [insertCities(toInsert), updateCities(toUpdate)];
    return Promise.all(updatePromises);
};
const insertCities = function(cities){
    if(!cities || !cities.length)
        return Promise.resolve(true);
    const citiesObject = cities.map((c)=>{
        return {name: {he: c.name}, defaultCircle: c.defaultCircle};
    });
    const query = City.insertMany(citiesObject);
    return query;
};
const updateCities = function(cities){
    let updatePromises = [];
    for(let i=0; i<cities.length; i++){
        const curr = cities[i];
        const query = City.updateOne({'_id': mongoose.Types.ObjectId(curr._id)}, {
            "name.he" : curr.name,
            "defaultCircle" : curr.defaultCircle
        });
        updatePromises.push(query.exec());
    }
    return Promise.all(updatePromises);
};
module.exports = {
    saveCities
};

