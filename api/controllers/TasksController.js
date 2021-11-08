const Task = require("../models/Task");
const Comment = require("../models/Comment");
const User = require("../models/User");

//VALIDATION
const { createTaskValidation, updateTaskValidation } = require("../validation");

async function sendErrorMessage(res, err) {
  if (err.name === "CastError") {
    let [type, ...others] = err.message.split(" ").reverse();
    type = type.substr(1, type.length - 2);
    res.status(404).json({ Error: `${type} not found` });
  } else {
    res.status(500).json({ Error: err.message });
  }
}
async function userExists(username) {
  return (await User.findOne({ username: username })) ? true : false;
}

async function taskExists(id) {
  return (await Task.findById(id)) ? true : false;
}

async function taskOwnedByUser(taskId, userId) {
  const task = await Task.findOne({ _id: taskId, userId: userId });
  return task ? true : false;
}

async function getUserIdByUsername(username) {
  const user = await User.findOne({ username: username } /*, "userId"*/);
  return user.id;
}

module.exports = {
  //-----------------------------------------------------------------------------------------------------------
  //CREATE-----------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------
  create: async function (req, res) {
    try {
      //Validate data
      const { error } = createTaskValidation(req.body);
      if (error) return res.status(400).json({ Error: error.details[0].message });

      //Check if user exists in database
      if (!(await userExists(req.params.username))) return res.status(404).json({ Error: "User not found" });

      //Create task object
      const newTask = Task({
        name: req.body.name,
        userId: await getUserIdByUsername(req.params.username),
        date: req.body.date,
        categories: req.body.categories,
      });

      //Save task to database
      const task = await newTask.save();
      res.status(201).json(task);
    } catch (err) {
      sendErrorMessage(res, err);
    }
  },

  //-----------------------------------------------------------------------------------------------------------
  //UPDATE-----------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------
  update: async function (req, res) {
    try {
      //Validate data
      const { error } = updateTaskValidation(req.body);
      if (error) return res.status(400).json({ Error: error.details[0].message });

      //Check if user exists in database
      if (!(await userExists(req.params.username))) return res.status(404).json({ Error: "User not found" });

      //Check if tasks exists in database
      if (!(await taskExists(req.params.id))) return res.status(404).json({ Error: "Task not found" });

      //Check if task is owned by the user
      if (!(await taskOwnedByUser(req.params.id, await getUserIdByUsername(req.params.username)))) return res.status(404).json({ Error: "Task not found" });

      //Update data and save to database
      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedTask);
    } catch (err) {
      sendErrorMessage(res, err);
    }
  },

  //-----------------------------------------------------------------------------------------------------------
  //DELETE-----------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------
  delete: async function (req, res) {
    try {
      //Check if user exists in database
      if (!(await userExists(req.params.username))) return res.status(404).json({ Error: "User not found" });

      //Check if tasks exists in database
      if (!(await taskExists(req.params.id))) return res.status(404).json({ Error: "Task not found" });

      //Check if task is owned by the user
      if (!(await taskOwnedByUser(req.params.id, await getUserIdByUsername(req.params.username)))) return res.status(404).json({ Error: "Task not found" });

      //Delete task and all resources related to it
      await Task.findByIdAndDelete({ _id: req.params.id });
      await Comment.deleteMany({ taskId: req.params.id });
      res.sendStatus(204);
    } catch (err) {
      sendErrorMessage(res, err);
    }
  },

  //-----------------------------------------------------------------------------------------------------------
  //GET--------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------
  get: async function (req, res) {
    try {
      //Check if user exists in database
      if (!(await userExists(req.params.username))) return res.status(404).json({ Error: "User not found" });

      //Check if tasks exists in database
      if (!(await taskExists(req.params.id))) return res.status(404).json({ Error: "Task not found" });

      //Check if task is owned by the user
      if (!(await taskOwnedByUser(req.params.id, await getUserIdByUsername(req.params.username)))) return res.status(404).json({ Error: "Task not found" });

      //Get task
      const task = await Task.findById({ _id: req.params.id });
      res.status(200).json(task);
    } catch (err) {
      sendErrorMessage(res, err);
    }
  },

  //-----------------------------------------------------------------------------------------------------------
  //GET ALL----------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------
  getAll: async function (req, res) {
    try {
      //Check if user exists in database
      if (!(await userExists(req.params.username))) return res.status(404).json({ Error: "User not found" });

      //Get all tasks
      const tasks = await Task.find({
        userId: await getUserIdByUsername(req.params.username),
      });
      if (tasks.length === 0) res.status(404).json({ Error: "No tasks found." });
      else res.status(200).json(tasks);
    } catch (err) {
      sendErrorMessage(res, err);
    }
  },
};
