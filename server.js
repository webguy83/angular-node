const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
require('dotenv').config();

const Post = require('./backend/models/post');

const app = express();

mongoose.connect(`mongodb+srv://jankguy83:${process.env.MONGO_DB_PASSWORD}@cluster-bunk.lfrbt.mongodb.net/node-angular?retryWrites=true&w=majority`)
  .then(() => console.log('DB is on yay!'))
  .catch(console.log)

app.use(bodyParser.json());
app.use(cors());

app.post("/posts", (req, res, next) => {
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

app.get('/posts/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    res.status(200).json({
      message: "found the post",
      post: post
    })
  })
    .catch(console.log)
})

app.put("/posts/:id", (req, res, next) => {
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

app.get("/posts", (req, res, next) => {
  Post.find().then(posts => {
    res.status(200).json({
      message: "success",
      posts
    })
  }).catch(console.log)
})

app.delete('/posts/:id', (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id
  }).then(() => {
    res.status(200).json({
      message: 'Entry deleted'
    })
  })
    .catch(console.log)
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Hazaah the server is going! Yes!')
})
