const Task = require("../models/Task");
const Comment = require("../models/Comment");
const User = require("../models/User");

//VALIDATION
const { createCommentValidation, updateCommentValidation } = require("../validation");

async function sendErrorMessage(res, err) {
  if (err.name === "CastError") {
    let [type, ...others] = err.message.split(" ").reverse();
    type = type.substr(1, type.length - 2);
    res.status(404).json({ Error: `${type} not found.` });
  } else {
    res.status(500).json({ Error: err.message });
  }
}

async function userExists(username) {
  return (await User.findOne({ username })) ? true : false;
}

async function taskExists(id) {
  return (await Task.findById(id)) ? true : false;
}

async function commentExists(id) {
  return (await Comment.findById(id)) ? true : false;
}

async function taskOwnedByUser(taskId, userId) {
  const task = await Task.findOne({ _id: taskId, userId: userId });
  return task ? true : false;
}

async function commentOwnedByTask(commentId, taskId) {
  const comment = await Comment.findOne({ _id: commentId, taskId: taskId });
  return comment ? true : false;
}

async function getUserIdByUsername(username) {
  const user = await User.findOne({ username: username });
  return user.id;
}

module.exports = {
  //-----------------------------------------------------------------------------------------------------------
  //CREATE-----------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------
  create: async function (req, res) {
    try {
      //Validate data
      const { error } = createCommentValidation(req.body);
      if (error) return res.status(400).json({ Error: error.details[0].message });

      //Check if user exists in database
      if (!(await userExists(req.params.username))) return res.status(404).json({ Error: "User not found" });

      //Check if task exists in database
      if (!(await taskExists(req.params.taskId))) return res.status(404).json({ Error: "Task not found" });

      //Check if task is owned by the user
      if (!(await taskOwnedByUser(req.params.taskId, await getUserIdByUsername(req.params.username)))) return res.status(404).json({ Error: "Task not found" });

      //Create comment object
      const newComment = Comment({
        text: req.body.text,
        taskId: req.params.taskId,
        userId: await getUserIdByUsername(req.params.username),
      });

      //Save comment to database
      const comment = await newComment.save();
      res.status(201).json(comment);
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
      const { error } = updateCommentValidation(req.body);
      if (error) return res.status(400).json({ Error: error.details[0].message });

      //Check if user exists in database
      if (!(await userExists(req.params.username))) return res.status(404).json({ Error: "User not found" });

      //Check if task exists in database
      if (!(await taskExists(req.params.taskId))) return res.status(404).json({ Error: "Task not found" });

      //Check if comment exists in database
      if (!(await commentExists(req.params.id))) return res.status(404).json({ Error: "Comment not found" });

      //Check if task is owned by the user
      if (!(await taskOwnedByUser(req.params.taskId, await getUserIdByUsername(req.params.username)))) return res.status(404).json({ Error: "Task not found" });

      //Check if comment is owned by the task
      if (!(await commentOwnedByTask(req.params.id, req.params.taskId))) return res.status(404).json({ Error: "Comment not found" });

      //Update data and save to database
      const updatedComment = await Comment.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedComment);
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

      //Check if task exists in database
      if (!(await taskExists(req.params.taskId))) return res.status(404).json({ Error: "Task not found" });

      //Check if comment exists in database
      if (!(await commentExists(req.params.id))) return res.status(404).json({ Error: "Comment not found" });

      //Check if task is owned by the user
      if (!(await taskOwnedByUser(req.params.taskId, await getUserIdByUsername(req.params.username)))) return res.status(404).json({ Error: "Task not found" });

      //Check if comment is owned by the task
      if (!(await commentOwnedByTask(req.params.id, req.params.taskId))) return res.status(404).json({ Error: "Comment not found" });

      //Delete comment
      await Comment.findByIdAndDelete({ _id: req.params.id });
      res.status(200).json({ Message: "Comment has been deleted" });
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

      //Check if task exists in database
      if (!(await taskExists(req.params.taskId))) return res.status(404).json({ Error: "Task not found" });

      //Check if comment exists in database
      if (!(await commentExists(req.params.id))) return res.status(404).json({ Error: "Comment not found" });

      //Check if task is owned by the user
      if (!(await taskOwnedByUser(req.params.taskId, await getUserIdByUsername(req.params.username)))) return res.status(404).json({ Error: "Task not found" });

      //Check if comment is owned by the task
      if (!(await commentOwnedByTask(req.params.id, req.params.taskId))) return res.status(404).json({ Error: "Comment not found" });

      //Get comment
      const comment = await Comment.findById({ _id: req.params.id });
      res.status(200).json(comment);
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

      //Check if task exists in database
      if (!(await taskExists(req.params.taskId))) return res.status(404).json({ Error: "Task not found" });

      //Check if task is owned by the user
      if (!(await taskOwnedByUser(req.params.taskId, await getUserIdByUsername(req.params.username)))) return res.status(404).json({ Error: "Task not found" });

      const comments = await Comment.find({
        userId: await getUserIdByUsername(req.params.username),
        taskId: req.params.taskId,
      });
      if (comments.length === 0) res.status(404).json("No comments found.");
      else res.status(200).json(comments);
    } catch (err) {
      sendErrorMessage(res, err);
    }
  },
};
