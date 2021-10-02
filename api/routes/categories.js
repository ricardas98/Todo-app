const router = require("express").Router();
const Category = require("../models/Category");
const Task = require("../models/Task");

async function categoryExists(id) {
	return (await Category.findById(id)) ? true : false;
}

//CREATE
router.post("/", async (req, res) => {
	try {
		const newCategory = Category({
			name: req.body.name,
			username: req.body.username,
		});

		const category = await newCategory.save();
		res.status(200).json(category);
	} catch (err) {
		res.status(500).json(err);
	}
});

//UPDATE
router.put("/:id", async (req, res) => {
	try {
		if (await categoryExists(req.params.id)) {
			try {
				const updatedCategory = await Category.findByIdAndUpdate(
					req.params.id,
					{
						$set: req.body,
					},
					{ new: true }
				);
				res.status(200).json(updatedCategory);
			} catch {
				res.status(500).json(err);
			}
		} else {
			res.status(404).json("Category not found.");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//DELETE
router.delete("/:id", async (req, res) => {
	try {
		if (await categoryExists(req.params.id)) {
			const category = await Category.findById(req.params.id);

			await Category.findByIdAndDelete(req.params.id);
			const tasks = await Task.find({ categories: category.name });

			tasks.forEach(async (task) => {
				const categories = task.categories.filter((x) => x !== category.name);

				await Task.findByIdAndUpdate(
					task.id,
					{
						categories: categories,
					},
					{ new: true }
				);
			});

			await res.status(200).json("Category has been deleted.");
		} else {
			res.status(404).json("Category not found.");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET
router.get("/:id", async (req, res) => {
	try {
		if (await categoryExists(req.params.id)) {
			const category = await Category.findById(req.params.id);
			res.status(200).json(category);
		} else {
			res.status(404).json("Category not found.");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET ALL
router.get("/", async (req, res) => {
	try {
		const categories = await Category.find();
		if (categories.length === 0) res.status(404).json("No categories found.");
		else res.status(200).json(categories);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;

/*
//CREATE
router.post("/", async (req, res) => {
	try {
		const newCategory = Category({
			name: req.body.name,
			username: req.body.username,
		});

		const category = await newCategory.save();

		res.status(200).json(category);
	} catch (err) {
		res.status(500).json(err);
	}
});

//UPDATE
router.put("/:id", async (req, res) => {
	try {
		const updatedCategory = await Category.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		res.status(200).json(updatedCategory);
	} catch (err) {
		res.status(500).json(err);
	}
});

//DELETE
router.delete("/:id", async (req, res) => {
	try {
		const categories = await Category.findById(req.params.id);
		await categories.delete();
		res.status(200).json("Category has been deleted.");
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET
router.get("/:id", async (req, res) => {
	try {
		const category = await Category.findById(req.params.id);
		res.status(200).json(category);
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET ALL
router.get("/", async (req, res) => {
	try {
		const category = await Category.find();
		res.status(200).json(category);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
*/
