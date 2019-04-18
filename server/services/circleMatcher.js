const circleFetcher = require("./circleFetcher");
const cityFetcher = require("./cityFetcher");
const arrayFunctions = require("./arrayFunctions");


let circleDict = {};
let cityDict = {};
const initMatcher = function(){
    const fetchPromises = [cityFetcher.getCities(), circleFetcher.getCircles()];
    return Promise.all(fetchPromises).then((results)=>{
            cityDict = arrayFunctions.indexByField(results[0], "name");
            circleDict = arrayFunctions.indexByField(results[1], "name");
        }
    );
};
const getCircleByCity = function(city){
    if(!city || !cityDict[city]) {
        return null;
    }
    const cityObject = cityDict[city];
    if(cityObject.defaultCircle && circleDict[cityObject.defaultCircle]) {
        return circleDict[cityObject.defaultCircle];
    }
    return null;
};
module.exports = {
    initMatcher,
    getCircleByCity
};