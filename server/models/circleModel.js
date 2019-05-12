const mongoose = require('mongoose');

const circleSchema = new mongoose.Schema({
    metadata: {
        creationDate: {
            type: Date,
            required: true,
        },
        lastUpdate: {
            type: Date,
            required: true,
        }
    },
    name: {
        type: String,
        required: false,
    },
    mailchimpList: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('circle', circleSchema);