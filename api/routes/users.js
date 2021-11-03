const router = require("express").Router();

const usersController = require("../controllers/UsersController");

//CREATE
router.post("/", async (req, res) => usersController.create(req, res));

//UPDATE
router.put("/:username", async (req, res) => usersController.update(req, res));

//DELETE
router.delete("/:username", async (req, res) =>
	usersController.delete(req, res)
);

//GET
router.get("/:username", async (req, res) => usersController.get(req, res));

//GET ALL
router.get("/", async (req, res) => usersController.getAll(req, res));

module.exports = router;
