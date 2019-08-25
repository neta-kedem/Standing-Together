const mongoose = require('mongoose');
Schema = mongoose.Schema;

const whatsappSessionSchema = new mongoose.Schema({
    metadata: {
        creationDate: {
            type: Date,
            required: true,
        },
        lastUpdate: {
            type: Date,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'activist',
            required: true
        }
    },
    qrUrl: {
        type: String,
        required: false
    },
    profileImg: {
        type: String,
        required: false
    },
    contactCount: {
        type: Number,
        required: true,
        default: 0
    },
    processedContactCount: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model('whatsappSession', whatsappSessionSchema);