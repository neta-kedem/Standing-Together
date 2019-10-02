const arrayFunctions = require('../arrayFunctions');
const castDates = function(query){
    arrayFunctions.deepFix(query, (key, value) => {return value.castToDate}, (val) => {
        val = new Date(val.castToDate);
        return val;
    });
};

module.exports = {
    castDates
};