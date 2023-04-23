const express = require('express');
const Post = require('../models/Post');
const auth = require('../middlewares/auth');

const router = express.Router();

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name email');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while getting the blog posts' });
  }
});

// Get a single blog post
router.get('/:id', async (req, res) => {
 
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email');
    if (!post) {
    return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(200).json(post);
    } catch (error) {
    res.status(500).json({ message: 'An error occurred while getting the blog post' });
    }
    });
    
    // Create a new blog post
    router.post('/', auth, async (req, res) => {
    const { title, content } = req.body;
    
    try {
    const post = new Post({
    title,
    content,
    author: req.userId,
    });
    await post.save();

    res.status(201).json({ message: 'Blog post created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while creating the blog post' });
    }
    });
    
    // Update an existing blog post
    router.put('/:id', auth, async (req, res) => {
    const { title, content } = req.body;
    
    try {
    const post = await Post.findById(req.params.id);
    if (!post) {
    return res.status(404).json({ message: 'Blog post not found' });
    }
    if (post.author.toString() !== req.userId) {
      return res.status(401).json({ message: 'Not authorized to update this blog post' });
    }
    
    post.title = title;
    post.content = content;
    post.updatedAt = Date.now();
    
    await post.save();
    
    res.status(200).json({ message: 'Blog post updated successfully' });

  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating the blog post' });
    }
    });
    
    // Delete an existing blog post
    router.delete('/:id', auth, async (req, res) => {
    try {
    const post = await Post.findById(req.params.id);
    if (!post) {
    return res.status(404).json({ message: 'Blog post not found' });
    }

if (post.author.toString() !== req.userId) {
  return res.status(401).json({ message: 'Not authorized to delete this blog post' });
}

await post.delete();

res.status(200).json({ message: 'Blog post deleted successfully' });

} catch (error) {
  res.status(500).json({ message: 'An error occurred while deleting the blog post' });
  }
  });
  
  module.exports = router;
