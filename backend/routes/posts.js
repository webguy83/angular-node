const express = require('express');
const Post = require('../models/post');
const multer = require('multer');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let error;
    if (MIME_TYPE_MAP[file.mimetype]) {
      error = null;
    } else {
      error = new Error('Invalid mime type!')
    }
    cb(error, './backend/images')
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}.${MIME_TYPE_MAP[file.mimetype]}`)
  }
})

router.get("", (req, res, next) => {
  const { pagesize, currentpage } = req.query;
  const postQuery = Post.find();
  let posts = [];

  if (pagesize && currentpage) {
    postQuery.skip(+pagesize * (+currentpage - 1))
      .limit(+pagesize)
  }

  postQuery.then(docs => {
    posts = docs;
    return Post.countDocuments()
  })
    .then(count => {
      res.status(200).json({
        message: "success",
        totalPosts: count,
        posts
      })
    })
    .catch(console.log)
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

router.post("", multer({ storage }).single("image"), (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })
  post.save().then((data) => {
    res.status(201).json({
      message: "sent to the database",
      post: {
        id: data._id,
        title: data.title,
        content: data.content,
        imagePath: data.imagePath
      }
    })
  }).catch(console.log)

})

router.put("/:id", multer({ storage }).single("image"), (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })
  Post.updateOne({ _id: req.params.id }, post).then(() => {
    res.status(200).json({
      message: `The post ${post.title} was updated`
    })
  })
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
