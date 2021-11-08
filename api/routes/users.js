const router = require("express").Router();

const usersController = require("../controllers/UsersController");
const authController = require("../controllers/AuthenticationController");

//CREATE/REGISTER
router.post("/", async (req, res) => usersController.create(req, res));

//LOGIN
router.post("/login", async (req, res) => usersController.login(req, res));

//UPDATE
router.put("/:username", authController.authUser, async (req, res) => usersController.update(req, res));

//DELETE
router.delete("/:username", authController.authAll, async (req, res) => usersController.delete(req, res));

//GET
router.get("/:username", authController.authAll, async (req, res) => usersController.get(req, res));

//GET ALL
router.get("/", authController.authAdmin, async (req, res) => usersController.getAll(req, res));

module.exports = router;
