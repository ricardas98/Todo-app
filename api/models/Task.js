const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		date: {
			type: Date,
			required: true,
		},
		categories: {
			type: Array,
			required: false,
		},
		completed: {
			type: Boolean,
			default: false,
		},
		username: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
