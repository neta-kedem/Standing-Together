const City = require('../models/cityModel');
const getCities = function (){
    const query = City.find();
    const citiesPromise = query.exec().then((cities) => {
        let cityList = [];
        for(let city of cities)
        {
            cityList.push({
                "_id":city._id,
                "nameHe":city.name.he,
                "nameAr":city.name.ar,
                "defaultCircle":city.defaultCircle
            });
        }
        return cityList;
    });
    return citiesPromise;
};
const getCityByName = function (name){
    const query = City.find({"name.he": name});
    const cityPromise = query.exec().then((cities) => {
        if(cities && cities.length){
            return {
                "_id": cities[0]._id,
                "name": cities[0].name.he,
                "defaultCircle": cities[0].defaultCircle
            };
        }
        else{
            return null;
        }
    });
    return cityPromise;
};
module.exports = {
    getCities,
    getCityByName
};