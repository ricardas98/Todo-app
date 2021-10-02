const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: true,
		},
		taskId: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
