const mongoose = require('mongoose');

const crowdfundingDonationSchema = new mongoose.Schema({
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
    },
    sum: {
        type: Number,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('crowdfundingDonation', crowdfundingDonationSchema);