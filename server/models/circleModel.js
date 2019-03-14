const mongoose = require('mongoose');

const circleSchema = new mongoose.Schema({
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