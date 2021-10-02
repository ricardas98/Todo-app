const router = require("express").Router();

const Task = require("../models/Task");
const Comment = require("../models/Comment");

async function taskExists(id) {
	return (await Task.findById(id)) ? true : false;
}

//CREATE
router.post("/", async (req, res) => {
	try {
		const newTask = Task({
			name: req.body.name,
			username: req.body.username,
			date: req.body.date,
		});

		const task = await newTask.save();
		res.status(200).json(task);
	} catch (err) {
		res.status(500).json(err);
	}
});

//UPDATE
router.put("/:id", async (req, res) => {
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
});

//DELETE
router.delete("/:id", async (req, res) => {
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
});

//GET
router.get("/:id", async (req, res) => {
	try {
		if (await taskExists(req.params.id)) {
			const task = await Task.findById(req.params.id);
			res.status(200).json(task);
		} else {
			res.status(404).json("Task not found.");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET ALL
router.get("/", async (req, res) => {
	try {
		const tasks = await Task.find();
		if (tasks.length === 0) res.status(404).json("No tasks found.");
		else res.status(200).json(tasks);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;

/*
//CREATE
router.post("/", async (req, res) => {
	try {
		const newTask = Task({
			name: req.body.name,
			username: req.body.username,
		});

		const task = await newTask.save();

		res.status(200).json(task);
	} catch (err) {
		res.status(500).json(err);
	}
});

//UPDATE
router.put("/:id", async (req, res) => {
	try {
		const updatedTask = await Task.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		res.status(200).json(updatedTask);
	} catch (err) {
		res.status(500).json(err);
	}
});

//DELETE
router.delete("/:id", async (req, res) => {
	try {
		const task = await Task.findById(req.params.id);
		try {
			await Comment.deleteMany({ taskId: req.params.id });

			await task.delete();

			res.status(200).json("Task has been deleted.");
		} catch {
			res.status(500).json(err);
		}
	} catch (err) {
		res.status(404).json("Task not found");
	}
});

//GET
router.get("/:id", async (req, res) => {
	try {
		const task = await Task.findById(req.params.id);
		res.status(200).json(task);
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET ALL
router.get("/", async (req, res) => {
	try {
		const task = await Task.find();
		res.status(200).json(task);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
*/
