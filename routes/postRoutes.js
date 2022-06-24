const express = require('express');

const { getAllPosts, getOnePost, createPost, updatePost, deletePost } = require('../controllers/postController')
const protect = require('../authMiddleware/authMiddleware')

const router = express.Router();

//  localhost:3000/
router.route('/')
    .get(getAllPosts)
    .post(protect, createPost)

// localhost:3000/id/
router.route('/:id')
    .get(getOnePost)
    .patch(updatePost)
    .delete(deletePost)

module.exports = router;