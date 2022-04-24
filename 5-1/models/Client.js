const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "User Name is required"],
    },
    address: {
        type: String,
        required: [true, "Address is required"],
    },
    avatar: { type: String, default: "https://via.placeholder.com/90" },
    chats: [{ user: { type: String, required: true }, messages: [{ type: String }] }],
    date_registered: { type: Date, default: new Date() },
    longitude: { type: Number, default: 0 },
    latitude: { type: Number, default: 0 },
    ticket: [
        {
            description: { type: String, required: true },
            isDone: { type: Boolean, default: false },
            tech: { type: String, default: null },
        },
    ],
});

module.exports = mongoose.model("Client", clientSchema);
//module.exports allows us to use the file as a module, similar to packages, and can be used by other files
