const mongoose = require('mongoose');

const memberRegistrationSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    donationId: {
        type: String,
        required: false
    },
    data: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('memberRegistration', memberRegistrationSchema);