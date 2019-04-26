const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const eventSchema = new mongoose.Schema({
	metadata: {
		//timestamp for when the event was first saved
		creationDate: {
			type:Date,
			required: true,
		},
		//timestamp for when the event was last saved
		lastUpdate: {
			type:Date,
			required: true,
		},
		//_id of the activist (user) who created the event
		creatorId: {
			type: String,
			required: true,
		}
	},
	eventDetails: {
		//the title given to the event
		name: {
			type: String,
			required: true,
		},
		//the date the event is scheduled for
		date: {
			type: Date,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		//the location where the event will take place
		location: {
			type: String,
			required: false
		},
	},
	//instructions for phone operators ("callers")
	callInstructions: {
		question1: {
			type: String,
			required: false,
		},
		text1: {
			type: String,
			required: false,
		},
		question2: {
			type: String,
			required: false,
		},
		text2: {
			type: String,
			required: false,
		},
		script: {
			type: String,
			required: false,
		},
	},
	//data about the phone-banking campaign associated with the event
	campaign: {
		type:{
			metadata: {
				//when was the first assignment of invitations to the event
				creationDate: {
					type:Date,
					required: true,
				},
				//when was the last change of assignments to the event
				lastUpdate: {
					type:Date,
					required: true,
				},
				//_id of the activist (user) who first assigned invitations to the event
				creatorId: {
					type: String,
					required: true,
				},
			},
			//json representation of the query used to filter user to invite
			selectionQuery: {
				type: String,
				required: true
			},
			//a hash concatenated to urls in order to direct to this event
			eventCode: {
				type: String,
				required: true
			},
			//a list of all the invited users, and various properties of the invitation
			invitations: {
				type:[{
					//the _id of an invited activist
					activistId: {type: String, required: true},
					//the results of the invitation - once this isn't null, the user should cease to come up in the callers queue
					resolution: {
						type: {
							//did the activist indicate their intent to arrive at the event
							attendingEvent: {type: Boolean, required: true},
							//did the activist agree to contribute their hard earned money to fuel the revolution?
							contributed: {type: Boolean, required: true},
						},
						required: false
					},
					//if the activist was called, when? (filled automatically, when a call outcome button is pressed)
					lastCallAt: {type: Date},
					//how many times the activist has been called throughout the campaign
					callCount: {type: Number, required: true, default:0},
					//if the activist has asked to be called at a later hour, when?
					availableAt: {type: Date},
					//if null - means that the activist never showed up on anyone's phone-lsit. Otherwise, contains the date of the last ping from a callers client which displayed this activist.
					//as long as the las ping wasn't too long ago, the activist won't show up on any other phone lists.
					lastPing: {type: Date},
					//_id of the activist who was last tasked with carrying out this invitation (i.e. call the activist)
					//this doesn't have a purpose currently, because we don't bind activists to specific callers, but maybe it would be useful for statistical analysis sometime.
					callerId: {type: String}
				}]
			}
		},
		required: false
	}
});
eventSchema.plugin(mongoosePaginate);
const eventModel = mongoose.model('event', eventSchema);
module.exports = eventModel;
