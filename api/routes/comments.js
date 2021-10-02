const router = require("express").Router();
const Comment = require("../models/Comment");

async function commentExists(id) {
	return (await Comment.findById(id)) ? true : false;
}

//CREATE
router.post("/", async (req, res) => {
	try {
		const newComment = Comment({
			text: req.body.text,
			taskId: req.body.taskId,
			username: req.body.username,
		});

		const comment = await newComment.save();
		res.status(200).json(comment);
	} catch (err) {
		res.status(500).json(err);
	}
});

//UPDATE
router.put("/:id", async (req, res) => {
	try {
		if (await commentExists(req.params.id)) {
			try {
				const updatedComment = await Comment.findByIdAndUpdate(
					req.params.id,
					{
						$set: req.body,
					},
					{ new: true }
				);
				res.status(200).json(updatedComment);
			} catch {
				res.status(500).json(err);
			}
		} else {
			res.status(404).json("Comment not found.");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//DELETE
router.delete("/:id", async (req, res) => {
	try {
		if (await commentExists(req.params.id)) {
			await Comment.findByIdAndDelete(req.params.id);
			res.status(200).json("Comment has been deleted.");
		} else {
			res.status(404).json("Comment not found.");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET
router.get("/:id", async (req, res) => {
	try {
		if (await commentExists(req.params.id)) {
			const comment = await Comment.findById(req.params.id);
			res.status(200).json(comment);
		} else {
			res.status(404).json("Comment not found.");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET ALL
router.get("/", async (req, res) => {
	try {
		const comments = await Comment.find();
		if (comments.length === 0) res.status(404).json("No comments found.");
		else res.status(200).json(comments);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;

/*
//CREATE
router.post("/", async (req, res) => {
	try {
		const newComment = Comment({
			text: req.body.text,
			taskId: req.body.taskId,
			username: req.body.username,
		});

		const comment = await newComment.save();

		res.status(200).json(comment);
	} catch (err) {
		res.status(500).json(err);
	}
});

//UPDATE
router.put("/:id", async (req, res) => {
	try {
		const updatedComment = await Comment.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		res.status(200).json(updatedComment);
	} catch (err) {
		res.status(500).json(err);
	}
});

//DELETE
router.delete("/:id", async (req, res) => {
	try {
		const comment = await Comment.findById(req.params.id);
		await comment.delete();
		res.status(200).json("Comment has been deleted.");
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET
router.get("/:id", async (req, res) => {
	try {
		const comment = await Comment.findById(req.params.id);
		res.status(200).json(comment);
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET ALL
router.get("/", async (req, res) => {
	try {
		const comment = await Comment.find();
		res.status(200).json(comment);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
*/
