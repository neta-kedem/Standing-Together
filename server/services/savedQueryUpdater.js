const mongoose = require('mongoose');
const SavedQuery = require('../models/savedQueryModel');
const Authentication = require('../services/authentication');

const saveQuery = function(query){
    const today = new Date();
    const creatorId = Authentication.getMyId();
    if(!query._id){
        const newSavedQuery = new SavedQuery({
            metadata:{
                creationDate: today,
                lastUpdate: today,
                creatorId: creatorId
            },
            name: query.name,
            filters: query.filters
        });
        return newSavedQuery.save();
    }
    else{
        return SavedQuery.updateOne({_id: mongoose.Types.ObjectId(query._id)},{
            "metadata.lastUpdate": today,
            name: query.name,
            filters: query.filters
        })
    }
};
module.exports = {
    saveQuery
};

