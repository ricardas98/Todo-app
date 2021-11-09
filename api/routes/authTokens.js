const router = require("express").Router();
const authController = require("../controllers/AuthenticationController");

//GET NEW ACCESS TOKEN
router.get("/users/:username/tokens", authController.authAll, async (req, res) => authController.getNewAccessToken(req, res));

//DELETE
router.delete("/users/:username/tokens/:value", authController.authAll, async (req, res) => authController.delete(req, res));

//DELETE ALL
router.delete("/tokens", authController.authAdmin, async (req, res) => authController.deleteAll(req, res));

//GET ALL
router.get("/tokens", authController.authAdmin, async (req, res) => authController.getAll(req, res));

module.exports = router;
