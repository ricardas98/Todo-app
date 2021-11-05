const User = require("../models/User");
const Task = require("../models/Task");
const Comment = require("../models/Comment");
const Category = require("../models/Category");

const bcrypt = require("bcrypt");

async function userExists(username) {
  return (await User.findOne({ username: username })) ? true : false;
}

async function emailExists(email) {
  return (await User.findOne({ email: email })) ? true : false;
}

//VALIDATION
const { createUserValidation, updateUserValidation } = require("../validation");

module.exports = {
  //-----------------------------------------------------------------------------------------------------------
  //CREATE-----------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------
  create: async function (req, res) {
    try {
      //Validate data
      const { error } = createUserValidation(req.body);
      if (error) return res.status(400).json({ Error: error.details[0].message });

      //Check if email exists in database
      if (await emailExists(req.body.email)) return res.status(400).json({ Error: "User already exists" });

      //Check if username exists in database
      if (await userExists(req.body.username)) return res.status(400).json({ Error: "User already exists" });

      //Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      //Create user object
      const newUser = User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });

      //Save user to database
      const user = await newUser.save();
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  },

  //-----------------------------------------------------------------------------------------------------------
  //UPDATE-----------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------
  update: async function (req, res) {
    try {
      //Validate data
      const { error } = updateUserValidation(req.body);
      if (error) return res.status(400).json({ Error: error.details[0].message });

      //Check if user exists in database
      if (!(await userExists(req.params.username))) return res.status(404).json({ Error: "User not found" });

      //Update data and save to database
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }

      const user = await User.findOne({ username: req.params.username });
      const updatedUser = await User.findByIdAndUpdate(
        user.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  },

  //-----------------------------------------------------------------------------------------------------------
  //DELETE-----------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------
  delete: async function (req, res) {
    try {
      //Check if user exists in database
      if (!(await userExists(req.params.username))) return res.status(404).json({ Error: "User not found" });

      //Delete user and all resources related to them
      const user = await User.findOne({ username: req.params.username });
      await user.delete();
      await Category.deleteMany({ userId: user._id });
      await Task.deleteMany({ userId: user._id });
      await Comment.deleteMany({ userId: user._id });

      res.status(200).json({ Message: "User has been deleted" });
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  },

  //-----------------------------------------------------------------------------------------------------------
  //GET--------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------
  get: async function (req, res) {
    //Check if user exists in database
    if (!(await userExists(req.params.username))) return res.status(404).json({ Error: "User not found" });

    //Get user
    try {
      const user = await User.findOne({ username: req.params.username });
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  },

  //-----------------------------------------------------------------------------------------------------------
  //GET ALL----------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------
  getAll: async function (req, res) {
    //Get all users
    try {
      const users = await User.find();
      if (users.length === 0) res.status(404).json("No users found");
      else res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  },
};
