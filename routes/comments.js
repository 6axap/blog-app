const express = require('express');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const auth = require('../middlewares/auth');

const router = express.Router();

// Get all comments for a blog post
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate('author', 'name email');
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while getting the comments' });
  }
});

// Create a new comment for a blog post
router.post('/:postId', auth, async (req, res) => {
  const { content } = req.body;

  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const comment = new Comment({
      content,
      author: req.userId,
      post: req.params.postId,
    });

    await comment.save();

    post.comments.push(comment._id);
    await post.save();

    res.status(201).json({ message: 'Comment created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while creating the comment' });
  }
});

// Update an existing comment
router.put('/:id', auth, async (req, res) => {
  const { content } = req.body;

  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.userId) {
      return res.status(401).json({ message: 'Not authorized to update this comment' });
    }

    comment.content = content;
    comment.updatedAt = Date.now();

    await comment.save();

    res.status(200).json({ message: 'Comment updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating the comment' });
  }
});

// Delete an existing comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.userId) {
      return res.status(401).json({ message: 'Not authorized to delete this comment' });
    }
    
    
    const post = await Post.findById(comment.post);
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    const commentIndex = post.comments.indexOf(comment._id);
    if (commentIndex > -1) {
      post.comments.splice(commentIndex, 1);
      await post.save();
    }
    
    await comment.delete();
    
    res.status(200).json({ message: 'Comment deleted successfully' });
    
    } catch (error) {
    res.status(500).json({ message: 'An error occurred while deleting the comment' });
    }
    });
    
    module.exports = router;

    // Path: routes/posts.js
    // Compare this snippet from routes/posts.js:
    // // Get all blog posts
    // router.get('/', async (req, res) => {
    // try {
    // const posts = await Post.find().populate('author', 'name email');
    // res.status(200).json(posts);
    // } catch (error) {
    // res.status(500).json({ message: 'An error occurred while getting the blog posts' });
    // }
    // });
    // 
    // // Get a single blog post
    // router.get('/:id', async (req, res) => {
    // try {
    // const post = await Post.findById(req.params.id).populate('author', 'name email');
    // if (!post) {
    // return res.status(404).json({ message: 'Blog post not found' });
    // }
    // res.status(200).json(post);
    // } catch (error) {
    // res.status(500).json({ message: 'An error occurred while getting the blog post' });
    // }
    // });
    // 
    // // Create a new blog post
    // router.post('/', auth, async (req, res) => {
    // const { title, content } = req.body;
    // 
    // try {
    // const post = new Post({
    // title,
    // content,