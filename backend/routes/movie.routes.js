const express = require('express');
const router = express.Router();
const { 
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  searchMovies,
  getMovieDetailsFromTmdb,
  createMovieFromTmdb,
  uploadMoviePoster,
  toggleWatchedStatus,
  toggleToWatchStatus,
  toggleFavoriteStatus,
  rateMovie,
  deleteRating
} = require('../controllers/movieController');
const { protect } = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

// Rutas públicas
router.get('/', getMovies);
router.get('/search', searchMovies);
router.get('/:id', getMovieById);

// Rutas protegidas
router.post('/', protect, createMovie);
router.put('/:id', protect, updateMovie);
router.delete('/:id', protect, deleteMovie);

// Rutas de TMDb
router.get('/tmdb/:id', getMovieDetailsFromTmdb);
router.post('/tmdb', protect, createMovieFromTmdb);

// Rutas para gestionar upload de póster
router.post('/:id/poster', protect, uploadMiddleware.uploadPoster, uploadMoviePoster);

// Rutas para marcar películas
router.post('/:id/watch', protect, toggleWatchedStatus);
router.post('/:id/to-watch', protect, toggleToWatchStatus);
router.post('/:id/favorite', protect, toggleFavoriteStatus);

// Rutas para valorar películas
router.post('/:id/rate', protect, rateMovie);
router.delete('/:id/rate', protect, deleteRating);

module.exports = router;
