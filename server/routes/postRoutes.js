const express = require('express');
const router = express.Router();
const multer = require('multer');
const { body } = require('express-validator');
const path = require('path');
const fs = require('fs');
const postController = require('../controllers/postController');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

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