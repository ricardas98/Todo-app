const mongoose = require("mongoose");
const dotenv = require("dotenv");
const express = require("express");
const app = express();

const userRoute = require("./routes/users");
const categoryRoute = require("./routes/categories");
const commentRoute = require("./routes/comments");
const taskRoute = require("./routes/tasks");

dotenv.config();
app.use(express.json());

mongoose
  .connect(process.env.COSMOS_URL)
  .then(console.log("Connected to Mongo DB"))
  .catch((err) => console.log(err));

app.use("/api/users", userRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/comments", commentRoute);
app.use("/api/tasks", taskRoute);

app.listen("5000", () => {
  console.log("Backend running");
});
