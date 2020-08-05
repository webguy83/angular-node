const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
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
    .catch(() => {
      res.status(500).json({
        message: 'getting posts failed'
      })
    })
}

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    res.status(200).json({
      message: "found the post",
      post: post
    })
  })
    .catch(() => {
      res.status(500).json({
        message: 'getting post failed'
      })
    })
}

exports.createPost = (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    creator: req.userData.userId
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
  }).catch(() => {
    res.status(500).json({ message: 'Failed to create a post' })
  })
}

exports.updatePost = (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    creator: req.userData.userId
  })
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then((result) => {
    if (result.nModified > 0) {
      res.status(200).json({
        message: `The post ${post.title} was updated`
      })
    } else {
      res.status(401).json({ message: 'Not Authorized!' })
    }
  })
    .catch(() => {
      res.status(500).json({
        message: 'Cannot update post'
      })
    })
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id,
    creator: req.userData.userId
  }).then((result) => {
    if (result.n > 0) {
      res.status(200).json({
        message: `The post was deleted`
      })
    } else {
      res.status(401).json({ message: 'Not Authorized to delete!' })
    }
  })
    .catch(() => {
      res.status(500).json({
        message: 'Deleting post failed'
      })
    })
}
