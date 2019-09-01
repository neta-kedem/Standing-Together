/**
 * given an array, this function turns it into a dictionary, based on some unique property
 * @param array - an input array, containing objects with some unique key
 * @param indexBy - the name of the property the output dictionary will be indexed by
 */
const indexByField = function(array, indexBy){
    const dict = {};
    for(let i=0; i<array.length; i++){
        let elem = array[i];
        elem._index=i;
        dict[elem[indexBy]]=elem;
    }
    return dict;
};
/**
 * given an object, this function traverses it recursively.
 * Whenever a key is encountered that passes the supplied condition,
 * the value stored in said key undergoes the specified transformation.
 * @param obj - the object to traverse
 * @param condition - a function that, given a key, return true IFF the value stored under said key should be transformed
 * @param valueMapping - a function that, given a value, performs the desired transformation
 */
const deepFix = function(obj, condition, valueMapping){
    Object.keys(obj).forEach(key => {
        if(condition(key, obj[key])){
            obj[key] = valueMapping(obj[key]);
        }
        if (typeof obj[key] === 'object') {
            deepFix(obj[key], condition, valueMapping)
        }
    })
};

module.exports = {
    indexByField,
    deepFix
};

