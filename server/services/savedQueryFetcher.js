const SavedQuery = require('../models/savedQueryModel');

const getSavedQueries = function (){
    const query = SavedQuery.find({}, {name: 1});
    return query.exec();
};
const getSavedQuery = function (id){
    const query = SavedQuery.findById(id);
    return query.exec();
};
module.exports = {
    getSavedQueries,
    getSavedQuery,
};