const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const PASS_MIN_LENGTH = 7;
const userShema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    minlength: [
      PASS_MIN_LENGTH,
      `Error, password must be of minimum length : ${PASS_MIN_LENGTH}`,
    ],
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

userShema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model("user", userShema);
