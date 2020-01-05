const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    usageDate: {
        type: Date,
        required: true,
    },
    url: {
        type: String,
        required: false,
    },
    data: {
        type: String,
        required: false,
    }
});

module.exports = mongoose.model('trackedLink', linkSchema);