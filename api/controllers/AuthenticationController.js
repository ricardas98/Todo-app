const AuthToken = require("../models/AuthToken");
const User = require("../models/User");

const jwt = require("jsonwebtoken");

//VALIDATION
const { getNewAccessTokenValidation } = require("../validation");
const UsersController = require("./UsersController");

async function getUserIdByUsername(username) {
  const user = await User.findOne({ username: username } /*, "userId"*/);
  return user ? user.id : " ";
}

async function tokenOwnedByUser(tokenId, userId) {
  const token = await AuthToken.findOne({ value: tokenId, userId: userId });
  return token ? true : false;
}

async function userExists(username) {
  return (await User.findOne({ username: username })) ? true : false;
}

async function tokenExists(value) {
  return (await AuthToken.findOne({ value: value })) ? true : false;
}

module.exports = {
  authUser: function (req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
      //Check if token is valid
      if (err) return res.status(403).json({ Error: "Access denied" });

      //Check if user can access the resource
      if (user.userId !== (await getUserIdByUsername(req.params.username))) return res.status(403).json({ Error: "Access denied" });

      next();
    });
  },

  authAdmin: function (req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      //Check if token is valid
      if (err) return res.status(403).json({ Error: "Access denied" });

      //Check if user can access the resource
      if (user.role !== "admin") return res.status(403).json({ Error: "Access denied" });
      next();
    });
  },

  authAll: function (req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
      //Check if token is valid
      if (err) return res.status(403).json({ Error: "Access denied" });

      //Check if user can access the resource
      if (user.userId !== (await getUserIdByUsername(req.params.username)) && user.role !== "admin") return res.status(403).json({ Error: "Access denied" });
      next();
    });
  },

  generateAccessToken: function (user) {
    //Create user payload for access token
    const userPayload = {
      userId: user._id,
      role: user.role,
    };

    //Create access token
    return jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
  },

  generateRefreshToken: async function (user) {
    //Delete user's refresh token if there is one
    await AuthToken.deleteOne({ userId: user._id });

    //Create user payload for refresh token
    const userPayload = {
      userId: user._id,
      role: user.role,
    };

    //Create refresh token
    const tokenValue = jwt.sign(userPayload, process.env.REFRESH_TOKEN_SECRET);
    const newAuthToken = AuthToken({
      userId: user._id,
      value: tokenValue,
    });
    const refreshToken = await newAuthToken.save();
    return refreshToken.value;
  },

  getNewAccessToken: async function (req, res) {
    try {
      //Validate data
      const { error } = getNewAccessTokenValidation(req.body);
      if (error) return res.status(400).json({ Error: error.details[0].message });

      //Check if user already has a refresh token in database
      if (!(await tokenExists(req.body.refreshToken))) return res.status(404).json({ Error: "Token not found" });

      jwt.verify(req.body.refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        //Check if token is valid
        if (err) return res.status(403).json({ Error: "Access denied" });

        //Generate new token
        const accessToken = this.generateAccessToken(user);
        res.status(200).json({ accessToken });
      });
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  },
  getAll: async function (req, res) {
    try {
      //Get all tokens
      const tokens = await AuthToken.find();
      if (tokens.length === 0) res.status(404).json({ Error: "No tokens found" });
      else res.status(200).json({ Count: tokens.length, Tokens: tokens });
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  },

  deleteAll: async function (req, res) {
    try {
      //Delete all tokens
      await AuthToken.deleteMany();
      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  },

  delete: async function (req, res) {
    try {
      //Check if user exists in database
      if (!(await userExists(req.params.username))) return res.status(404).json({ Error: "User not found" });

      //Check if token is owned by the user
      if (!(await tokenOwnedByUser(req.params.value, await getUserIdByUsername(req.params.username)))) return res.status(404).json({ Error: "Token not found" });

      //Delete token
      await AuthToken.deleteOne({ value: req.params.value });
      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ Error: err.message });
    }
  },
};
