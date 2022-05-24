const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
	username: String,
	message: String,
	date: {
		type: Date,
		default: new Date(),
	},
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
