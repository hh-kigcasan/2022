const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	first_name: {
		type: String,
		required: true,
	},
	last_name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
		unique: true,
	},
	province: {
		type: String,
		required: true,
	},
	user_level: {
		type: String,
		enum: ["Admin", "User"],
		default: "User",
	},
	password: {
		type: String,
		required: true,
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

module.exports = mongoose.model("user", userSchema);
