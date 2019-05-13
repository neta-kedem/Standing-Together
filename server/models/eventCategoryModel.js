const mongoose = require('mongoose');

const eventCategorySchema = new mongoose.Schema({
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
            required: true,
        },
        ar: {
            type: String,
            required: false,
            default: ""
        }
    },
    /*not used currently. If we ever want to allow category nesting, we can use this field*/
    superCategory: {
        type: String,
        required: false,
        default: null
    }
});

module.exports = mongoose.model('eventCategory', eventCategorySchema);