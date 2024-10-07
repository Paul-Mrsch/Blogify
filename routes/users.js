var express = require("express");
const User = require("../models/userShema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var router = express.Router();

// router.get("/", function (req, res, next) {
//   const user = new User({
//     username: "John Doe",
//     email: "johny",
//     password: "password",
//   });
//   user.save().then(
//     () => console.log("One entry added"),
//     (err) => console.log(err)
//   );
// });

/* GET users profile. */
router.get("/:id", function (req, res, next) {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  User.findById(id, (deleted = false))
    .then((user) => {
      if (!user) {
        res.status(404).send("User not found or has been deleted!");
      } else {
        res.status(200).json({
          username: user.username,
          email: user.email,
          password: user.password,
        });
      }
    })
    .catch((err) => {
      console.error("Error finding user by ID: ", err);
      res.status(500).send("Internal Server Error");
    });
});

router.put("/:id", function (req, res, next) {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  const { username, email, password } = req.body
    ? req.body
    : {
        username: "",
        email: "",
        password: "",
      };

  User.findByIdAndUpdate(
    { _id: id, deleted: false },
    { username, email, password },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        res.status(404).send("User not found or has been deleted!");
      } else {
        res.status(200).json({
          username: user.username,
          email: user.email,
          password: user.password,
        });
      }
    })
    .catch((err) => {
      console.error("Error finding user by ID: ", err);
      res.status(500).send("Internal Server Error");
    });
});

router.delete("/:id", function (req, res, next) {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  User.findByIdAndUpdate(
    (id, (deleted = false)),
    { deleted: true },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        res.status(404).send("User not found or has already been deleted!");
      } else {
        res.status(200).json({
          username: user.username,
          email: user.email,
          deleted: user.deleted,
        });
      }
    })
    .catch((err) => {
      console.error("Error finding user by ID: ", err);
      res.status(500).send("Internal Server Error");
    });
});

router.post("/register", function (req, res, next) {
  const { username, email, password } = req.body
    ? req.body
    : {
        username: "",
        email: "",
        password: "",
      };

  const user = new User({
    username,
    email,
    password,
    deleted: false,
  });

  user.save().then(
    () => {
      res.status(201).json({
        username: user.username,
        email: user.email,
        password: user.password,
      });
    },
    (err) => {
      console.error("Error saving user: ", err);
      res.status(500).send("Internal Server Error");
    }
  );
});
router.post("/login", function (req, res, next) {
  const { email, password } = req.body ? req.body : { email: "", password: "" };

  User.findOne({ email, deleted: false })
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found or has been deleted!");
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error("Error comparing passwords: ", err);
          return res.status(500).send("Internal Server Error");
        }

        if (!isMatch) {
          return res.status(401).send("Invalid credentials");
        }

        const token = jwt.sign(
          { id: user._id, email: user.email },
          "your_jwt_secret",
          { expiresIn: "1h" }
        );

        res.status(200).json({ token });
      });
    })
    .catch((err) => {
      console.error("Error finding user by email: ", err);
      res.status(500).send("Internal Server Error");
    });
});

module.exports = router;
