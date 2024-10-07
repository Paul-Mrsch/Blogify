var express = require("express");
const Post = require("../models/postShema");
var router = express.Router();

router.post("/", function (req, res, next) {
  const { title, content, author, tags } = req.body;
  if (!title || !content || !author || !tags) {
    return res.status(400).json({ message: "Invalid post data" });
  }

  const post = new Post({
    title,
    content,
    author,
    tags,
    created_at: new Date(),
    updated_at: new Date(),
  });

  post.save().then(
    () => {
      res.status(200).json({ message: "Post added successfully" });
    },
    (err) => {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  );
});

router.get("/", function (req, res, next) {
  const { tag, author, date } = req.query;
  let filter = {};

  if (tag) {
    filter.tags = tag;
  }
  if (author) {
    filter.user_id = author;
  }
  if (date) {
    filter.createdAt = { $gte: new Date(date) };
  }

  Post.find(filter)
    .then((posts) => {
      if (posts.length === 0) {
        return res.status(404).json({ message: "No posts found" });
      }
      res.status(200).json(posts);
    })
    .catch((err) => {
      console.error("Error retrieving posts: ", err);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

router.get("/:id", function (req, res, next) {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Invalid post id" });
  }

  Post.findById(id, (deleted = false))
    .then((post) => {
      if (!post) {
        res.status(404);
        res.send("Post not found !");
      }
      res.status(200).json({
        title: post.title,
        content: post.content,
        author: post.author,
      });
    })
    .catch((err) => {
      console.error("Error finding post by ID: ", err);
      res.status(500).send("Internal Server Error");
    });
});

router.put("/:id", function (req, res, next) {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Invalid post id" });
  }

  const { title, content, author } = req.body
    ? req.body
    : {
        title: "",
        content: "",
        author: "",
      };

  Post.findByIdAndUpdate(
    { _id: id, deleted: false },
    { title, content, author, updated_at: new Date() },
    { new: true }
  )
    .then((post) => {
      if (!post) {
        res.status(404);
        res.send("Post not found !");
      }
      res.status(200).json({
        title: post.title,
        content: post.content,
        author: post.author,
      });
    })
    .catch((err) => {
      console.error("Error finding post by ID: ", err);
      res.status(500).send("Internal Server Error");
    });
});

router.delete("/:id", function (req, res, next) {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Invalid post id" });
  }
  Post.findByIdAndUpdate(
    id,
    { deleted: true, updated_at: new Date() },
    { new: true }
  )
    .then((post) => {
      if (!post) {
        res.status(404);
        res.send("Post not found !");
      }
      res.status(200).json({
        title: post.title,
        body: post.body,
        user_id: post.user_id,
        deleted: post.deleted,
      });
    })
    .catch((err) => {
      console.error("Error updating post by ID: ", err);
      res.status(500).send("Internal Server Error");
    });
});

module.exports = router;
