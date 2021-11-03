const router = require("express").Router();
const categoriesController = require("../controllers/CategoriesController");

//CREATE
router.post("/users/:username/categories", async (req, res) =>
	categoriesController.create(req, res)
);

//UPDATE
router.put("/users/:username/categories/:id", async (req, res) =>
	categoriesController.update(req, res)
);

//DELETE
router.delete("/users/:username/categories/:id", async (req, res) =>
	categoriesController.delete(req, res)
);

//GET
router.get("/users/:username/categories/:id", async (req, res) =>
	categoriesController.get(req, res)
);

//GET ALL
router.get("/users/:username/categories", async (req, res) =>
	categoriesController.getAll(req, res)
);

module.exports = router;
