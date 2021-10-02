const router = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");
const Task = require("../models/Task");
const Comment = require("../models/Comment");
const Category = require("../models/Category");

async function userExists(id) {
	return (await User.findById(id)) ? true : false;
}

//CREATE
router.post("/", async (req, res) => {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		const newUser = User({
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword,
		});

		const user = await newUser.save();
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

//UPDATE
router.put("/:id", async (req, res) => {
	try {
		if (await userExists(req.params.id)) {
			try {
				if (req.body.password) {
					const salt = await bcrypt.genSalt(10);
					req.body.password = await bcrypt.hash(req.body.password, salt);
				}
				const updatedUser = await User.findByIdAndUpdate(
					req.params.id,
					{
						$set: req.body,
					},
					{ new: true }
				);
				res.status(200).json(updatedUser);
			} catch {
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
router.delete("/:id", async (req, res) => {
	try {
		if (await userExists(req.params.id)) {
			const user = await User.findById(req.params.id);
			await user.delete();
			await Category.deleteMany({ username: user.username });
			await Task.deleteMany({ username: user.username });
			await Comment.deleteMany({ username: user.username });
			res.status(200).json("User has been deleted.");
		} else {
			res.status(404).json("User not found.");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET
router.get("/:id", async (req, res) => {
	try {
		if (await userExists(req.params.id)) {
			const user = await User.findById(req.params.id);
			res.status(200).json(user);
		} else {
			res.status(404).json("User not found.");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET ALL
router.get("/", async (req, res) => {
	try {
		const users = await User.find();
		if (users.length === 0) res.status(404).json("No users found.");
		else res.status(200).json(users);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
