const mongoose = require("mongoose");

const AuthTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuthToken", AuthTokenSchema);
