const mongoose = require("mongoose");

const commentShema = new mongoose.Schema({
  content: {
    type: String,
  },
  author: {
    type: String,
  },
  post_id: {
    type: String,
  },
  created_at: {
    type: Date,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("comment", commentShema);
