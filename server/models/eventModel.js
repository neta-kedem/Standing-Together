const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: String
});

module.exports = mongoose.model('event',eventSchema);
