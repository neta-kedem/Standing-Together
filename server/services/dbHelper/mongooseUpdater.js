const mongoose = require('mongoose');
const _update = function (model, query, update, arrayFilters, multi){
    return mongoose.connection.db.command({
        update: model.collection.name,
        updates:
        [{
            q: query,
            u: update,
            arrayFilters: arrayFilters,
            multi: multi
        }],
    })
};

module.exports = {
    _update
};

