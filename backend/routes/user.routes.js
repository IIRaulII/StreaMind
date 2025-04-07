const express = require('express');
const router = express.Router();
const { 
  updateUserProfile, 
  uploadAvatar, 
  getUserById 
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

// Rutas públicas
router.get('/:id', getUserById);

// Rutas protegidas
router.put('/profile', protect, updateUserProfile);
router.post('/avatar', protect, uploadMiddleware.uploadAvatar, uploadAvatar);

module.exports = router;
