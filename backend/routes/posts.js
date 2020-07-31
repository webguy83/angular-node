const express = require('express');
const Post = require('../models/post');

const router = express.Router();

router.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  })
  post.save().then((data) => {
    res.status(201).json({
      message: "sent to the database",
      postId: data._id
    })
  }).catch(console.log)

})

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    res.status(200).json({
      message: "found the post",
      post: post
    })
  })
    .catch(console.log)
})

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  })
  Post.updateOne({ _id: req.params.id }, post).then(result => {
    res.status(200).json({
      message: `The post ${post.title} was updated`
    })
  })
})

router.get("", (req, res, next) => {
  Post.find().then(posts => {
    res.status(200).json({
      message: "success",
      posts
    })
  }).catch(console.log)
})

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id
  }).then(() => {
    res.status(200).json({
      message: 'Entry deleted'
    })
  })
    .catch(console.log)
})

module.exports = router;
