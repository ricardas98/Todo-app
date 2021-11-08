const router = require("express").Router();

const commentsController = require("../controllers/CommentsController");
const authController = require("../controllers/AuthenticationController");

//CREATE
router.post("/users/:username/tasks/:taskId/comments", authController.authUser, async (req, res) => commentsController.create(req, res));

//UPDATE
router.put("/users/:username/tasks/:taskId/comments/:id", authController.authUser, async (req, res) => commentsController.update(req, res));

//DELETE
router.delete("/users/:username/tasks/:taskId/comments/:id", authController.authUser, async (req, res) => commentsController.delete(req, res));

//GET
router.get("/users/:username/tasks/:taskId/comments/:id", authController.authUser, async (req, res) => commentsController.get(req, res));

//GET ALL
router.get("/users/:username/tasks/:taskId/comments", authController.authUser, async (req, res) => commentsController.getAll(req, res));

module.exports = router;
