const Post = require('../models/Post');
const cloudinary = require('../config/cloudinary');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, caption } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    try {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(imageFile.path, {
        folder: 'vistagram',
      });

      const post = new Post({
        username,
        imageUrl: result.secure_url,
        caption,
      });

      await post.save();
      res.status(201).json(post);
    } finally {
      // Clean up the uploaded file
      if (imageFile.path) {
        fs.unlink(imageFile.path, (err) => {
          if (err) console.error('Error deleting temporary file:', err);
        });
      }
    }
  } catch (error) {
    // Clean up the uploaded file in case of error
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temporary file:', err);
      });
    }
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
};

// Like/Unlike a post
exports.toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const { username } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likedBy.indexOf(username);
    if (likeIndex === -1) {
      // Like the post
      post.likedBy.push(username);
      post.likes += 1;
    } else {
      // Unlike the post
      post.likedBy.splice(likeIndex, 1);
      post.likes -= 1;
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling like', error: error.message });
  }
};

// Share a post
exports.sharePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.shares += 1;
    await post.save();
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error sharing post', error: error.message });
  }
}; 