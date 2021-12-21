const User = require("../models/User");
const Task = require("../models/Task");
const Comment = require("../models/Comment");
const Category = require("../models/Category");
const AuthToken = require("../models/AuthToken");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = require("./AuthenticationController");

//VALIDATION
const { createUserValidation, updateUserValidation, loginUserValidation } = require("../validation");

async function userExists(username) {
  return (await User.findOne({ username: username })) ? true : false;
}

async function emailExists(email) {
  return (await User.findOne({ email: email })) ? true : false;
}

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

      const accessToken = authController.generateAccessToken(user);
      const refreshToken = await authController.generateRefreshToken(user);
      const username = user.username;
      res.status(201).json({ username, accessToken, refreshToken });
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  },
  //-----------------------------------------------------------------------------------------------------------
  //LOGIN-----------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------
  login: async function (req, res) {
    try {
      //Validate data
      const { error } = loginUserValidation(req.body);
      if (error) return res.status(400).json({ Error: error.details[0].message });

      //Check if email exists in database
      if (!(await emailExists(req.body.email))) return res.status(403).json({ Error: "Wrong email address or password" });

      //Compare passwords
      const user = await User.findOne({ email: req.body.email });
      if (await bcrypt.compare(req.body.password, user.password)) {
        const accessToken = authController.generateAccessToken(user);
        const refreshToken = await authController.generateRefreshToken(user);
        const username = user.username;
        res.status(201).json({ username, accessToken, refreshToken });
      } else {
        return res.status(403).json({ Error: "Wrong email address or password" });
      }
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
      let userPayload = updatedUser.toObject();
      delete userPayload.password;

      const accessToken = authController.generateAccessToken(userPayload);
      const refreshToken = await authController.generateRefreshToken(userPayload);

      res.status(200).json({ userPayload, accessToken, refreshToken });
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
      await AuthToken.deleteOne({ userId: user._id });

      res.sendStatus(204);
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
      let user = await User.findOne({ username: req.params.username });
      user = user.toObject();
      delete user.password;
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
      if (users.length === 0) res.status(404).json({ Error: "No users found" });
      else {
        let usersPayload = [];
        users.forEach((user) => {
          user = user.toObject();
          delete user.password;
          usersPayload.push(user);
        });
        res.status(200).json(usersPayload);
      }
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  },
};
