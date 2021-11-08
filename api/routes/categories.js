const router = require("express").Router();
const categoriesController = require("../controllers/CategoriesController");
const authController = require("../controllers/AuthenticationController");

//CREATE
router.post("/users/:username/categories", authController.authUser, async (req, res) => categoriesController.create(req, res));

//UPDATE
router.put("/users/:username/categories/:id", authController.authUser, async (req, res) => categoriesController.update(req, res));

//DELETE
router.delete("/users/:username/categories/:id", authController.authUser, async (req, res) => categoriesController.delete(req, res));

//GET
router.get("/users/:username/categories/:id", authController.authUser, async (req, res) => categoriesController.get(req, res));

//GET ALL
router.get("/users/:username/categories", authController.authUser, async (req, res) => categoriesController.getAll(req, res));

module.exports = router;
