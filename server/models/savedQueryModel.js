const mongoose = require('mongoose');

const savedQuerySchema = new mongoose.Schema({
    metadata: {
        creationDate: {
            type: Date,
            required: true,
        },
        lastUpdate: {
            type: Date,
            required: true,
        },
        //_id of the activist (user) who created the event
        creatorId: {
            type: String,
            required: true,
        }
    },
    name: {
            type: String,
            required: false,
        },
    filters: {
        type: String,
        required: false,
    }
});

module.exports = mongoose.model('savedQuery', savedQuerySchema);