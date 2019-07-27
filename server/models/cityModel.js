const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
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
        he: {
            type: String,
            required: false,
        },
        ar: {
            type: String,
            required: false,
        },
        alias: {
            type: [
                String
            ],
            required: false,
        }
    },
    location: {
        lng:{
            type: Number,
            required: false,
        },
        lat:{
            type: Number,
            required: false,
        }
    },
    defaultCircle:{
        type: String,
        required: false
    }
});

module.exports = mongoose.model('city', citySchema);