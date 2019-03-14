const City = require('../models/cityModel');
const getCities = function (){
    const query = City.find();
    const citiesPromise = query.exec().then((cities) => {
        let cityList = [];
        for(let city of cities)
        {
            cityList.push({
                "_id":city._id,
                "name":city.name.he,
                "defaultCircle":city.defaultCircle
            });
        }
        return cityList;
    });
    return citiesPromise;
};
module.exports = {
    getCities
};