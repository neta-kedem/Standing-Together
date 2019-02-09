const mongoose = require('mongoose');

const activistSchema = new mongoose.Schema({
	metadata: {
		creationDate: {
			type:Date,
			required: true,
		},
		lastUpdate: {
			type:Date,
			required: true,
		},
		joiningMethod: {
			type:String,
			enum: ['webSite', 'contactPage', 'memberPage'],
			required: true,
		},
		typerName: String,
		scanId: {type:String, required: false},
	},
	profile: {
		firstName: {
			type:String,
			required: true,
		},
		lastName: {
			type:String,
			required: true,
		},
		phone: String,
		email: String,
		residency: String,
		circle: {
			type:String,
			required: false,
			enum: ['חיפה', 'תל-אביב' , 'ירושלים', 'הנגב']
		},
		isMember: Boolean,
		isPaying: Boolean,
		isNewsletter: Boolean,
		participatedEvents: [String],
	},
	role: {
		isTyper: Boolean,
		isCaller: Boolean,
		isOrganizer: Boolean,
		isCircleLeader: Boolean,
	},
	login: {
		loginCode: String,
		token: [String]
	}
});

module.exports = mongoose.model('activist',activistSchema);
