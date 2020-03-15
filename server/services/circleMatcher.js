const circleFetcher = require("./circleFetcher");
const cityFetcher = require("./cityFetcher");
const arrayFunctions = require("./arrayFunctions");


let circleDict = null;
let cityDict = null;

const initMatcher = function(){
    circleDict = {};
    cityDict = {};
    const fetchPromises = [cityFetcher.getCities(), circleFetcher.getCircles()];
    return Promise.all(fetchPromises).then((results)=>{
            const cityDictHe = arrayFunctions.indexByField(results[0], "nameHe");
            const cityDictAr = arrayFunctions.indexByField(results[0], "nameAr");
            cityDict = Object.assign(cityDictHe, cityDictAr);
            circleDict = arrayFunctions.indexByField(results[1], "name");
        }
    );
};

const getCircleByCity = function(city){
    if(circleDict && cityDict){
        return new Promise((resolve)=>{
            if(!city || !cityDict[city]) {
                resolve(null);
            }
            const cityObject = cityDict[city];
            if(cityObject.defaultCircle && circleDict[cityObject.defaultCircle]) {
                resolve(circleDict[cityObject.defaultCircle]);
            }
            resolve(null);
        });
    }
    else{
        return fetchCircleByCity(city).then(circle => {
            return circle;
        })
    }
};

const fetchCircleByCity = function(city){
    return cityFetcher.getCityByName(city).then((result) => {
        if(!result || !result.defaultCircle || !result.defaultCircle.length){
            return null;
        }
        else{
            return circleFetcher.getCircleByName(result.defaultCircle).then((circle)=>{
                return circle;
            })
        }
    });
};
module.exports = {
    initMatcher,
    getCircleByCity
};