const express = require('express');

const checkAuth = require('../middlewares/check-auth');
const extraFile = require('../middlewares/file');
const PostController = require('../controllers/post');

const router = express.Router();

router.get("", PostController.getPosts)
router.get('/:id', PostController.getPost)
router.post("", checkAuth, extraFile, PostController.createPost)
router.put("/:id", checkAuth, extraFile, PostController.updatePost)
router.delete('/:id', checkAuth, PostController.deletePost)

module.exports = router;
