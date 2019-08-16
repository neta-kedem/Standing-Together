const mongoose = require('mongoose');
const arrayFunctions = require('../arrayFunctions');
const idifyObject = function(query){
    arrayFunctions.deepFix(query, (key) => {return key.indexOf("_id") !== -1}, (val) => {
        if (typeof val === 'string'){
            return mongoose.Types.ObjectId(val);
        }
        if(typeof val === 'object') {
            Object.keys(val).forEach(key => {
                if (typeof val[key] === 'string') {
                    val[key] = mongoose.Types.ObjectId(val[key]);
                }
            });
            return val;
        }
        return val;
    });
};

module.exports = {
    idifyObject
};