const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
Schema = mongoose.Schema;

const activistSchema = new mongoose.Schema({
	metadata: {
		creationDate: {
			type: Date,
			required: true,
		},
		lastUpdate: {
			type: Date,
			required: true,
		},
		joiningMethod: {
			type: String,
			enum: ['webSite', 'contactPage', 'memberPage'],
			required: true,
		},
		typerId: {type:String, required: false},
		scanId: {type:String, required: false},
		duplicateId: {type:String, required: false},
	},
	profile: {
		firstName: {
			type:String,
			required: true,
		},
		lastName: {
			type:String,
			required: false,
		},
		phone: String,
		email: String,
		residency: String,
		circle: {
			type:String,
			required: false
		},
		isMember: Boolean,
		isPaying: Boolean,
		isNewsletter: {
			type:String,
			required: false,
			default: 'not subscribed',
			enum: ['subscribed', 'unsubscribed' , 'not subscribed', 'cleaned', 'pending']
		},
		participatedEvents: [
			{type: Schema.Types.ObjectId, ref: 'event'}
		],
	},
	membership:{
		joiningDate: {
			type: Date,
			required: false,
		},
		street: {
			type: String,
			required: false,
		},
		houseNum: {
			type: String,
			required: false,
		},
		apartmentNum: {
			type: String,
			required: false,
		},
		mailbox: {
			type: String,
			required: false,
		},
		TZ: {
			type: String,
			required: false,
		},
		birthday: {
			type: Date,
			required: false,
		},
		required: false,
	},
	role: {
		isTyper: Boolean,
		isCaller: Boolean,
		isOrganizer: Boolean,
		isCircleLeader: Boolean,
	},
	login: {
		loginCode: String,
		locked: {
			type: Boolean,
			default: false,
		},
		lockToken: {
			type: String,
			required: false
		},
		tokens: [{
			token: {type: String},
			issuedAt: {type: Date},
			lastUsage: {type: Date},
			unlockToken: {type: String, required: false}
		}],
		failedLoginCount:{
			type: Number,
			default: 0
		},
		lastLoginAttempt: Date
	}
});
activistSchema.plugin(mongoosePaginate);
activistSchema.plugin(aggregatePaginate);
const activistModel = mongoose.model('activist',activistSchema);
module.exports = activistModel;