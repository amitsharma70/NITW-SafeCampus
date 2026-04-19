const mongoose = require("mongoose");

const walkSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    destination: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },

    // 🔥 NEW FIELD (important)
    lastLocation: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },

    duration: {
      type: Number, // minutes
      required: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "completed", "expired"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WalkSession", walkSessionSchema);