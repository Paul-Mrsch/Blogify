var express = require("express");
const Like = require("../models/likeShema");
var router = express.Router();

router.post("/object/:id", function (req, res, next) {
  const { object_id, user_id } = req.body;
  if (!object_id || !user_id) {
    return res.status(400).json({ message: "Invalid like data" });
  }

  const like = new Like({
    object_id,
    user_id,
    created_at: new Date(),
  });

  like.save().then(
    () => {
      res.status(200).json({ message: "Like added successfully" });
    },
    (err) => {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  );
});

router.delete("/:id", function (req, res, next) {
  const id = req.params.id;
  const created_at = new Date();

  if (!id) {
    return res.status(400).json({ message: "Invalid like id" });
  }

  const { object_id, user_id } = req.body
    ? req.body
    : {
        object_id: "",
        user_id: "",
      };

  Like.findByIdAndUpdate(
    { _id: id, deleted: false },
    { object_id, user_id, created_at, deleted: true }
  ).then((like) => {
    if (!like) {
      res.status(404);
      res.send("Like not found !");
    }
    res.status(200).json({
      object_id: like.object_id,
      user_id: like.user_id,
      created_at: like.created_at,
      deleted: like.deleted,
    });
  });
});

router.get("/object/:id", function (req, res, next) {
  const object_id = req.params.id;

  Like.find({ object_id, deleted: false }).then((likes) => {
    if (!likes) {
      res.status(404);
      res.send("Likes not found !");
    }
    res.status(200).json(likes);
  });
});

module.exports = router;
