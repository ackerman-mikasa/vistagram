const express = require('express');
const router = express.Router();
const multer = require('multer');
const { body } = require('express-validator');
const postController = require('../controllers/postController');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Validation middleware
const postValidation = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('caption').trim().notEmpty().withMessage('Caption is required')
];

// Routes
router.get('/', postController.getPosts);
router.post('/', upload.single('image'), postValidation, postController.createPost);
router.post('/:postId/like', postController.toggleLike);
router.post('/:postId/share', postController.sharePost);

module.exports = router; 