const mongoose = require("mongoose");

const summarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  inputHash: {
    type: String,
    required: true,
    index: true
  },
  summary: {
    type: String,
    required: true
  },
  strategy: {
    type: String,
    required: true
  },
  chunks: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });


summarySchema.index(
  { userId: 1, inputHash: 1 },
  { unique: true }
);


module.exports = mongoose.model("Summary", summarySchema);
