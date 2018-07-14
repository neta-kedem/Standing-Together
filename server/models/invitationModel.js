const mongoose = require('mongoose');
const invitationSchema = new mongoose.Schema({
	//the _id of the relevant event
	activistId: {type: String, required: true},
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
	//if the activist has asked to be called at a later hour, when?
	availableAt: {type: Date},
	isHandled: {type: Boolean, required: true},
	//_id of the activist who was last tasked with carrying out this invitation (i.e. call the activist)
	//this doesn't have a purpose currently, because we don't bind activists to specific callers, but maybe it would be useful for statistical analysis sometime.
	callerId: {type: String}
});

module.exports = mongoose.model('invitation',invitationSchema);
