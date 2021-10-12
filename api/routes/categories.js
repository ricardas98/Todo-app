const router = require("express").Router();

const Category = require("../models/Category");
const Task = require("../models/Task");
const User = require("../models/User");

async function userExists(username) {
  return (await User.findOne({ username })) ? true : false;
}

async function categoryExists(id) {
  return (await Category.findById(id)) ? true : false;
}

async function categoryOwnedByUser(categoryId, userId) {
  const category = await Category.findOne({
    _id: categoryId,
    userId: userId,
  });
  return category ? true : false;
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
router.post("/users/:username/categories", async (req, res) => {
  try {
    if (await userExists(req.params.username)) {
      const newCategory = Category({
        name: req.body.name,
        userId: await getUserIdByUsername(req.params.username),
      });
      const category = await newCategory.save();

      res.status(201).json(category);
    } else {
      res.status(404).json({ Error: "User not found." });
    }
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
});

//UPDATE
router.put("/users/:username/categories/:id", async (req, res) => {
  try {
    if (await userExists(req.params.username)) {
      if (await categoryExists(req.params.id)) {
        if (
          await categoryOwnedByUser(
            req.params.id,
            await getUserIdByUsername(req.params.username)
          )
        ) {
          const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            {
              name: req.body.name,
            },
            { new: true }
          );

          res.status(200).json(updatedCategory);
        } else {
          res.status(404).json({ Error: "Category not found." });
        }
      } else {
        res.status(404).json({ Error: "Category not found." });
      }
    } else {
      res.status(404).json({ Error: "User not found." });
    }
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
});

//DELETE
router.delete("/users/:username/categories/:id", async (req, res) => {
  try {
    if (await userExists(req.params.username)) {
      if (await categoryExists(req.params.id)) {
        if (
          await categoryOwnedByUser(
            req.params.id,
            await getUserIdByUsername(req.params.username)
          )
        ) {
          await Category.findByIdAndDelete(req.params.id);
          const tasks = await Task.find({ categories: req.params.id });

          tasks.forEach(async (task) => {
            const categories = task.categories.filter(
              (x) => x !== req.params.id
            );

            await Task.findByIdAndUpdate(
              task.id,
              {
                categories: categories,
              },
              { new: true }
            );
          });

          res.status(200).json("Category has been deleted.");
        } else {
          res.status(404).json({ Error: "Category not found." });
        }
      } else {
        res.status(404).json({ Error: "Category not found." });
      }
    } else {
      res.status(404).json({ Error: "User not found." });
    }
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
});

//GET
router.get("/users/:username/categories/:id", async (req, res) => {
  try {
    if (await userExists(req.params.username)) {
      if (await categoryExists(req.params.id)) {
        if (
          await categoryOwnedByUser(
            req.params.id,
            await getUserIdByUsername(req.params.username)
          )
        ) {
          const category = await Category.findById({ _id: req.params.id });
          res.status(200).json(category);
        } else {
          res.status(404).json({ Error: "Category not found." });
        }
      } else {
        res.status(404).json({ Error: "Category not found." });
      }
    } else {
      res.status(404).json({ Error: "User not found." });
    }
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
});

//GET ALL
router.get("/users/:username/categories", async (req, res) => {
  try {
    if (await userExists(req.params.username)) {
      const categories = await Category.find({
        userId: await getUserIdByUsername(req.params.username),
      });
      if (categories.length === 0)
        res.status(404).json({ Error: "No categories found." });
      else res.status(200).json(categories);
    } else {
      res.status(404).json({ Error: "User not found." });
    }
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
});

module.exports = router;
