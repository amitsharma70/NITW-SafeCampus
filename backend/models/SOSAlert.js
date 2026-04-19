const mongoose = require("mongoose");

const sosSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      lat: Number,
      lng: Number,
    },
    message: {
      type: String,
      default: "Emergency! I need help.",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SOSAlert", sosSchema);