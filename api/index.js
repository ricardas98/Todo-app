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
	.connect(process.env.MONGO_URI)
	.then(console.log("Connected to Mongo DB"))
	.catch((err) => console.log(err));

app.use("/api/users", userRoute);
app.use("/api", categoryRoute);
app.use("/api", commentRoute);
app.use("/api", taskRoute);

app.use(function (req, res) {
	res.status(404).json({ Error: "Page not found." });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log("Backend running on port " + port);
});

/*
module.exports = {
    create: async function (req, res){},
    update: async function (req, res){},
    delete: async function (req, res){},
    get: async function (req, res){},
    getAll: async function (req, res){},
}
*/
