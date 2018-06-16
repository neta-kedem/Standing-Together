const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  callInstructions: {
	question1: {
		type: String,
		required: true,
	},
	text1: {
		type: String,
		required: true,
	},
	question2: {
		type: String,
		required: true,
	},
	text2: {
		type: String,
		required: true,
	},
	script: {
		type: String,
		required: true,
	}
  },
  date: {
    type: Date,
    required: true,
  },
  location: String
});

module.exports = mongoose.model('event',eventSchema);
