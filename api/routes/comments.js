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

async function commentExists(id) {
  return (await Comment.findById(id)) ? true : false;
}

async function taskOwnedByUser(taskId, userId) {
  const task = await Task.findOne({
    _id: taskId,
    userId: userId,
  });
  return task ? true : false;
}

async function commentOwnedByTask(commentId, taskId) {
  const comment = await Comment.findOne({
    _id: commentId,
    taskId: taskId,
  });
  return comment ? true : false;
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
router.post("/users/:username/tasks/:taskId/comments", async (req, res) => {
  try {
    if (await userExists(req.params.username)) {
      if (await taskExists(req.params.taskId)) {
        if (
          await taskOwnedByUser(
            req.params.taskId,
            await getUserIdByUsername(req.params.username)
          )
        ) {
          const newComment = Comment({
            text: req.body.text,
            taskId: req.params.taskId,
            userId: await getUserIdByUsername(req.params.username),
          });
          const comment = await newComment.save();

          res.status(201).json(comment);
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

/*
        const updatedComment = await Comment.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedComment);
*/
//UPDATE
router.put("/users/:username/tasks/:taskId/comments/:id", async (req, res) => {
  try {
    if (await userExists(req.params.username)) {
      if (await taskExists(req.params.taskId)) {
        if (
          await taskOwnedByUser(
            req.params.taskId,
            await getUserIdByUsername(req.params.username)
          )
        ) {
          if (await commentOwnedByTask(req.params.id, req.params.taskId)) {
            const updatedComment = await Comment.findByIdAndUpdate(
              req.params.id,
              {
                $set: req.body,
              },
              { new: true }
            );
            res.status(200).json(updatedComment);
          } else {
            res.status(404).json({ Error: "Comment not found." });
          }
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
router.delete(
  "/users/:username/tasks/:taskId/comments/:id",
  async (req, res) => {
    try {
      if (await userExists(req.params.username)) {
        if (await taskExists(req.params.taskId)) {
          if (
            await taskOwnedByUser(
              req.params.taskId,
              await getUserIdByUsername(req.params.username)
            )
          ) {
            if (await commentOwnedByTask(req.params.id, req.params.taskId)) {
              await Comment.findByIdAndDelete({ _id: req.params.id });
              res.status(200).json("Comment has been deleted.");
            } else {
              res.status(404).json({ Error: "Comment not found." });
            }
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
  }
);

//GET
router.get("/users/:username/tasks/:taskId/comments/:id", async (req, res) => {
  try {
    if (await userExists(req.params.username)) {
      if (await taskExists(req.params.taskId)) {
        if (
          await taskOwnedByUser(
            req.params.taskId,
            await getUserIdByUsername(req.params.username)
          )
        ) {
          if (await commentOwnedByTask(req.params.id, req.params.taskId)) {
            const comment = await Comment.findById({ _id: req.params.id });
            res.status(200).json(comment);
          } else {
            res.status(404).json({ Error: "Comment not found." });
          }
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
router.get("/users/:username/tasks/:taskId/comments", async (req, res) => {
  try {
    if (await userExists(req.params.username)) {
      if (await taskExists(req.params.taskId)) {
        if (
          await taskOwnedByUser(
            req.params.taskId,
            await getUserIdByUsername(req.params.username)
          )
        ) {
          const comments = await Comment.find({
            userId: await getUserIdByUsername(req.params.username),
            taskId: req.params.taskId,
          });
          if (comments.length === 0) res.status(404).json("No comments found.");
          else res.status(200).json(comments);
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

module.exports = router;
