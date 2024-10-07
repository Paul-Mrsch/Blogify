var express = require("express");
const Comment = require("../models/commentShema");
var router = express.Router();

router.post("/posts/:id/comments", function (req, res, next) {
  const { content, author, post_id } = req.body;
  if (!content || !author || !post_id) {
    return res.status(400).json({ message: "Invalid comment data" });
  }

  const comment = new Comment({
    content,
    author,
    post_id,
    created_at: new Date(),
  });

  comment.save().then(
    () => {
      res.status(200).json({ message: "Comment added successfully" });
    },
    (err) => {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  );
});

router.put("/:id", function (req, res, next) {
  const id = req.params.id;
  const created_at = new Date();

  if (!id) {
    return res.status(400).json({ message: "Invalid comment id" });
  }

  const { content, author, post_id } = req.body
    ? req.body
    : {
        content: "",
        author: "",
        post_id: "",
      };

  Comment.findByIdAndUpdate(
    { _id: id, deleted: false },
    { content, author, post_id, created_at }
  )
    .then((comment) => {
      if (!comment) {
        res.status(404);
        res.send("Comment not found !");
      }
      res.status(200).json({
        content: comment.content,
        author: comment.author,
        post_id: comment.post_id,
        created_at: comment.created_at,
      });
    })
    .catch((err) => {
      console.error("Error finding comment by ID: ", err);
      res.status(500).send("Internal Server Error");
    });
});

router.delete("/:id", function (req, res, next) {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Invalid comment id" });
  }

  Comment.findByIdAndUpdate(id, { deleted: true }, { new: true })
    .then((comment) => {
      if (!comment) {
        res.status(404);
        res.send("Comment not found !");
      }
      res.status(200).json({
        content: comment.content,
        author: comment.author,
        post_id: comment.post_id,
        created_at: comment.created_at,
        deleted: comment.deleted,
      });
    })
    .catch((err) => {
      console.error("Error finding comment by ID: ", err);
      res.status(500).send("Internal Server Error");
    });
});

module.exports = router;
