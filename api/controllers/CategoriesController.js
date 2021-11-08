const Category = require("../models/Category");
const Task = require("../models/Task");
const User = require("../models/User");

//VALIDATION
const { createCategoryValidation, updateCategoryValidation } = require("../validation");

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
  return (await User.findOne({ username: username })) ? true : false;
}

async function categoryExists(id) {
  return (await Category.findById(id)) ? true : false;
}

async function categoryOwnedByUser(categoryId, userId) {
  const category = await Category.findOne({ _id: categoryId, userId: userId });
  return category ? true : false;
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
      const { error } = createCategoryValidation(req.body);
      if (error) return res.status(400).json({ Error: error.details[0].message });

      //Check if user exists in database
      if (!(await userExists(req.params.username))) return res.status(404).json({ Error: "User not found" });

      //Create category object
      const newCategory = Category({
        name: req.body.name,
        userId: await getUserIdByUsername(req.params.username),
      });

      //Save task to database
      const category = await newCategory.save();
      res.status(201).json(category);
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
      const { error } = updateCategoryValidation(req.body);
      if (error) return res.status(400).json({ Error: error.details[0].message });

      //Check if user exists in database
      if (!(await userExists(req.params.username))) return res.status(404).json({ Error: "User not found" });

      //Check if tasks exists in database
      if (!(await categoryExists(req.params.id))) return res.status(404).json({ Error: "Category not found" });

      //Check if task is owned by the user
      if (!(await categoryOwnedByUser(req.params.id, await getUserIdByUsername(req.params.username)))) return res.status(404).json({ Error: "Category not found" });

      //Update data and save to database
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
        },
        { new: true }
      );
      res.status(200).json(updatedCategory);
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
      if (!(await categoryExists(req.params.id))) return res.status(404).json({ Error: "Category not found" });

      //Check if task is owned by the user
      if (!(await categoryOwnedByUser(req.params.id, await getUserIdByUsername(req.params.username)))) return res.status(404).json({ Error: "Category not found" });

      //Delete category and delete it from the tasks that have it
      await Category.findByIdAndDelete(req.params.id);
      const tasks = await Task.find({ categories: req.params.id });

      tasks.forEach(async (task) => {
        const categories = task.categories.filter((x) => x !== req.params.id);

        await Task.findByIdAndUpdate(
          task.id,
          {
            categories: categories,
          },
          { new: true }
        );
      });
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
      if (!(await categoryExists(req.params.id))) return res.status(404).json({ Error: "Category not found" });

      //Check if task is owned by the user
      if (!(await categoryOwnedByUser(req.params.id, await getUserIdByUsername(req.params.username)))) return res.status(404).json({ Error: "Category not found" });

      //Get category
      const category = await Category.findById({ _id: req.params.id });
      res.status(200).json(category);
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

      const categories = await Category.find({
        userId: await getUserIdByUsername(req.params.username),
      });
      if (categories.length === 0) res.status(404).json({ Error: "No categories found." });
      else res.status(200).json(categories);
    } catch (err) {
      sendErrorMessage(res, err);
    }
  },
};
