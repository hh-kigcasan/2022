const mongoose = require("mongoose");

const candidateSchema = mongoose.Schema({
	first_name: {
		type: String,
		required: true,
	},
	last_name: {
		type: String,
		required: true,
	},
	political_party: {
		type: String,
		required: true,
	},
	position: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	votes_gain: {
		type: Number,
		default: 0,
	},
	created_at: {
		type: Date,
		immutable: true,
		default: Date.now(),
	},
	updated_at: {
		type: Date,
	},
});

module.exports = mongoose.model("candidate", candidateSchema);
