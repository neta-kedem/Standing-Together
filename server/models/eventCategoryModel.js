const mongoose = require('mongoose');

const eventCategorySchema = new mongoose.Schema({
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
    superCategory: {
        type: String,
        required: false,
        default: null
    }
});

module.exports = mongoose.model('eventCategory', eventCategorySchema);