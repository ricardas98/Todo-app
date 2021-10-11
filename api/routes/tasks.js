const router = require("express").Router();

const Task = require("../models/Task");
const Comment = require("../models/Comment");
const User = require("../models/User");

async function taskExists(id) {
	return (await Task.findById(id)) ? true : false;
}

async function userExists(username) {
	return (await User.findOne({ username })) ? true : false;
}

async function taskOwnedByUser(taskId, userId) {
	task = await Task.find({ taskId: taskId });
	return task.userId === userId;
}

//CREATE
router.post("/users/:username/tasks", async (req, res) => {
	try {
		if (await userExists(req.params.username)) {
			try {
				const user = await User.findOne(
					{
						username: req.params.username,
					},
					"userId"
				);
				console.log(user.id);

				const newTask = Task({
					name: req.body.name,
					userId: user.id,
					date: req.body.date,
					categories: req.body.categories,
				});

				const task = await newTask.save();

				res.status(201).json(task);
			} catch (err) {
				res.status(500).json(err);
			}
		} else {
			res.status(404).json("User not found.");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//UPDATE
router.put("/users/:username/tasks/:id", async (req, res) => {
	try {
		if (await userExists(req.params.username)) {
			try {
				if (await taskExists(req.params.id)) {
					try {
						const updatedTask = await Task.findByIdAndUpdate(
							req.params.id,
							{
								$set: req.body,
							},
							{ new: true }
						);
						res.status(200).json(updatedTask);
					} catch {
						res.status(500).json(err);
					}
				} else {
					res.status(404).json("Task not found.");
				}
			} catch (err) {
				res.status(500).json(err);
			}
		} else {
			res.status(404).json("User not found.");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//DELETE
router.delete("/users/:username/tasks/:id", async (req, res) => {
	try {
		if (await userExists(req.params.username)) {
			try {
				if (await taskExists(req.params.id)) {
					await Task.findByIdAndDelete(req.params.id);
					await Comment.deleteMany({ taskId: req.params.id });
					res.status(200).json("Task has been deleted.");
				} else {
					res.status(404).json("Task not found.");
				}
			} catch (err) {
				res.status(500).json(err);
			}
		} else {
			res.status(404).json("User not found.");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET
router.get("/users/:username/tasks/:id", async (req, res) => {
	try {
		if (await userExists(req.params.username)) {
			try {
				const user = await User.findOne(
					{
						username: req.params.username,
					},
					"userId"
				);

				if (await taskOwnedByUser(req.params.id, user.id)) {
					const task = await Task.findById(req.params.id);
					res.status(200).json(task);
				} else {
					res.status(404).json("Task not found.");
				}
			} catch (err) {
				res.status(500).json(err);
			}
		} else {
			res.status(404).json("User not found.");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET ALL
router.get("/users/:username/tasks", async (req, res) => {
	try {
		if (await userExists(req.params.username)) {
			try {
				const user = await User.findOne(
					{
						username: req.params.username,
					},
					"userId"
				);

				const tasks = await Task.find({ userId: user.id });
				if (tasks.length === 0) res.status(404).json("No tasks found.");
				else res.status(200).json(tasks);
			} catch (err) {
				res.status(500).json(err);
			}
		} else {
			res.status(404).json("User not found.");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
