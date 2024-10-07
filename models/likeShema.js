const mongoose = require("mongoose");

const likeShema = new mongoose.Schema({
  object_id: {
    type: String,
  },
  user_id: {
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

module.exports = mongoose.model("like", likeShema);
