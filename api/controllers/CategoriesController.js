const Category = require("../models/Category");
const Task = require("../models/Task");
const User = require("../models/User");

async function sendErrorMessage(res, err) {
	if (err.name === "CastError") {
		let [type, ...others] = err.message.split(" ").reverse();
		type = type.substr(1, type.length - 2);
		res.status(404).json({ Error: `${type} not found.` });
	} else {
		res.status(500).json({ Error: err.message });
	}
}

async function userExists(username) {
	return (await User.findOne({ username })) ? true : false;
}

async function categoryExists(id) {
	return (await Category.findById(id)) ? true : false;
}

async function categoryOwnedByUser(categoryId, userId) {
	const category = await Category.findOne({
		_id: categoryId,
		userId: userId,
	});
	return category ? true : false;
}

async function getUserIdByUsername(username) {
	const user = await User.findOne(
		{
			username: username,
		},
		"userId"
	);
	return user.id;
}

module.exports = {
	create: async function (req, res) {
		try {
			if (await userExists(req.params.username)) {
				const newCategory = Category({
					name: req.body.name,
					userId: await getUserIdByUsername(req.params.username),
				});
				const category = await newCategory.save();

				res.status(201).json(category);
			} else {
				res.status(404).json({ Error: "User not found." });
			}
		} catch (err) {
			sendErrorMessage(res, err);
		}
	},

	update: async function (req, res) {
		try {
			if (await userExists(req.params.username)) {
				if (await categoryExists(req.params.id)) {
					if (
						await categoryOwnedByUser(
							req.params.id,
							await getUserIdByUsername(req.params.username)
						)
					) {
						const updatedCategory = await Category.findByIdAndUpdate(
							req.params.id,
							{
								name: req.body.name,
							},
							{ new: true }
						);

						res.status(200).json(updatedCategory);
					} else {
						res.status(404).json({ Error: "Category not found." });
					}
				} else {
					res.status(404).json({ Error: "Category not found." });
				}
			} else {
				res.status(404).json({ Error: "User not found." });
			}
		} catch (err) {
			sendErrorMessage(res, err);
		}
	},

	delete: async function (req, res) {
		try {
			if (await userExists(req.params.username)) {
				if (await categoryExists(req.params.id)) {
					if (
						await categoryOwnedByUser(
							req.params.id,
							await getUserIdByUsername(req.params.username)
						)
					) {
						await Category.findByIdAndDelete(req.params.id);
						const tasks = await Task.find({ categories: req.params.id });

						tasks.forEach(async (task) => {
							const categories = task.categories.filter(
								(x) => x !== req.params.id
							);

							await Task.findByIdAndUpdate(
								task.id,
								{
									categories: categories,
								},
								{ new: true }
							);
						});

						res.status(200).json("Category has been deleted.");
					} else {
						res.status(404).json({ Error: "Category not found." });
					}
				} else {
					res.status(404).json({ Error: "Category not found." });
				}
			} else {
				res.status(404).json({ Error: "User not found." });
			}
		} catch (err) {
			sendErrorMessage(res, err);
		}
	},

	get: async function (req, res) {
		try {
			if (await userExists(req.params.username)) {
				if (await categoryExists(req.params.id)) {
					if (
						await categoryOwnedByUser(
							req.params.id,
							await getUserIdByUsername(req.params.username)
						)
					) {
						const category = await Category.findById({ _id: req.params.id });
						res.status(200).json(category);
					} else {
						res.status(404).json({ Error: "Category not found." });
					}
				} else {
					res.status(404).json({ Error: "Category not found." });
				}
			} else {
				res.status(404).json({ Error: "User not found." });
			}
		} catch (err) {
			sendErrorMessage(res, err);
		}
	},

	getAll: async function (req, res) {
		try {
			if (await userExists(req.params.username)) {
				const categories = await Category.find({
					userId: await getUserIdByUsername(req.params.username),
				});
				if (categories.length === 0)
					res.status(404).json({ Error: "No categories found." });
				else res.status(200).json(categories);
			} else {
				res.status(404).json({ Error: "User not found." });
			}
		} catch (err) {
			res.status(500).json({ Error: err.message });
		}
	},
};
