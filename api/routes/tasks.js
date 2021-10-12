const router = require("express").Router();

const Task = require("../models/Task");
const Comment = require("../models/Comment");
const User = require("../models/User");

async function userExists(username) {
  return (await User.findOne({ username })) ? true : false;
}

async function taskExists(id) {
  return (await Task.findById(id)) ? true : false;
}

async function taskOwnedByUser(taskId, userId) {
  const task = await Task.findOne({
    _id: taskId,
    userId: userId,
  });
  return task ? true : false;
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

//CREATE
router.post("/users/:username/tasks", async (req, res) => {
  try {
    if (await userExists(req.params.username)) {
      const newTask = Task({
        name: req.body.name,
        userId: await getUserIdByUsername(req.params.username),
        date: req.body.date,
        categories: req.body.categories,
      });
      const task = await newTask.save();

      res.status(201).json(task);
    } else {
      res.status(404).json({ Error: "User not found." });
    }
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
});

//UPDATE
router.put("/users/:username/tasks/:id", async (req, res) => {
  try {
    if (await userExists(req.params.username)) {
      if (await taskExists(req.params.id)) {
        if (
          await taskOwnedByUser(
            req.params.id,
            await getUserIdByUsername(req.params.username)
          )
        ) {
          const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
              $set: req.body,
            },
            { new: true }
          );
          res.status(200).json(updatedTask);
        } else {
          res.status(404).json({ Error: "Task not found." });
        }
      } else {
        res.status(404).json({ Error: "Task not found." });
      }
    } else {
      res.status(404).json({ Error: "User not found." });
    }
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
});

//DELETE
router.delete("/users/:username/tasks/:id", async (req, res) => {
  try {
    if (await userExists(req.params.username)) {
      if (await taskExists(req.params.id)) {
        if (
          await taskOwnedByUser(
            req.params.id,
            await getUserIdByUsername(req.params.username)
          )
        ) {
          await Task.findByIdAndDelete({ _id: req.params.id });
          await Comment.deleteMany({ taskId: req.params.id });
          res.status(200).json("Task has been deleted.");
        } else {
          res.status(404).json({ Error: "Task not found." });
        }
      } else {
        res.status(404).json({ Error: "Task not found." });
      }
    } else {
      res.status(404).json({ Error: "User not found." });
    }
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
});

//GET
router.get("/users/:username/tasks/:id", async (req, res) => {
  try {
    if (await userExists(req.params.username)) {
      if (await taskExists(req.params.id)) {
        if (
          await taskOwnedByUser(
            req.params.id,
            await getUserIdByUsername(req.params.username)
          )
        ) {
          const task = await Task.findById({ _id: req.params.id });
          res.status(200).json(task);
        } else {
          res.status(404).json({ Error: "Task not found." });
        }
      } else {
        res.status(404).json({ Error: "Task not found." });
      }
    } else {
      res.status(404).json({ Error: "User not found." });
    }
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
});

//GET ALL
router.get("/users/:username/tasks", async (req, res) => {
  try {
    if (await userExists(req.params.username)) {
      const tasks = await Task.find({
        userId: await getUserIdByUsername(req.params.username),
      });
      if (tasks.length === 0)
        res.status(404).json({ Error: "No tasks found." });
      else res.status(200).json(tasks);
    } else {
      res.status(404).json({ Error: "User not found." });
    }
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
});

module.exports = router;
