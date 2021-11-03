const router = require("express").Router();

const tasksController = require("../controllers/TasksController");

//CREATE
router.post("/users/:username/tasks", async (req, res) =>
	tasksController.create(req, res)
);

//UPDATE
router.put("/users/:username/tasks/:id", async (req, res) =>
	tasksController.update(req, res)
);

//DELETE
router.delete("/users/:username/tasks/:id", async (req, res) =>
	tasksController.delete(req, res)
);

//GET
router.get("/users/:username/tasks/:id", async (req, res) =>
	tasksController.get(req, res)
);

//GET ALL
router.get("/users/:username/tasks", async (req, res) =>
	tasksController.getAll(req, res)
);

module.exports = router;
