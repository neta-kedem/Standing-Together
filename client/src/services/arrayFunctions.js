const indexByField = function(array, indexBy){
    const dict = {};
    for(let i = 0; i < array.length; i++){
        let elem = array[i];
        elem._index=i;
        dict[elem[indexBy]]=elem;
    }
    return dict;
};

const toDict = function(array){
    const dict = {};
    for(let i = 0; i < array.length; i++){
        let elem = array[i];
        dict[elem]=elem;
    }
    return dict;
};

const shuffle = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

export default {
    indexByField,
    toDict,
    shuffle
}
