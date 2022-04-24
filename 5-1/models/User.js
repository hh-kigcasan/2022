const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "User Name is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    avatar: { type: String, default: "" },
    chats: [{ user: { type: String, required: true }, messages: [{ type: String }] }],
    date_registered: { type: Date, default: new Date() },
    last_logged_in: { type: Date },
    longitude: { type: Number },
    latitude: { type: Number },
    is_admin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
//module.exports allows us to use the file as a module, similar to packages, and can be used by other files
