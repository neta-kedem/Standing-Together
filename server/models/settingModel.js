const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    values: {
        type: [String],
        required: true
    },
    type: {
        type: String,
        enum: ['text', 'number', 'email', 'date'],
        default: 'text',
        required: true,
    },
    singleValue: {
        type: Boolean,
        default: false,
        required: true,
    }
});

module.exports = mongoose.model('setting', settingSchema);