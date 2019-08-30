const mongoose = require('mongoose');
const arrayFunctions = require('../arrayFunctions');
const idifyObject = function(query){
    arrayFunctions.deepFix(query, (key, value) => {return value && value.castToId}, (val) => {
        if(typeof val === 'object') {
            Object.keys(val).forEach(key => {
                if (typeof val[key] === 'string') {
                    val[key] = mongoose.Types.ObjectId(val[key]);
                }
            });
            delete val.castToId;
            return val;
        }
        return val;
    });
};

module.exports = {
    idifyObject
};