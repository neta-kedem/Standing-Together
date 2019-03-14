const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
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
        longitude:{
            type: Number,
            required: false,
        },
        latitude:{
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