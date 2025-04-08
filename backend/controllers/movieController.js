const Movie = require('../models/Movie');
const tmdbService = require('../services/tmdbService');
const fs = require('fs');
const path = require('path');

/**
 * @desc    Buscar películas en TMDb
 * @route   GET /api/movies/search
 * @access  Public
 */
exports.searchMovies = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un término de búsqueda'
      });
    }

    const movies = await tmdbService.searchMovies(query);

    return res.status(200).json({
      success: true,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al buscar películas',
      error: error.message
    });
  }
};

/**
 * @desc    Obtener detalles de película de TMDb por ID
 * @route   GET /api/movies/tmdb/:id
 * @access  Private
 */
exports.getMovieDetailsFromTmdb = async (req, res) => {
  try {
    const { id } = req.params;

    const movieDetails = await tmdbService.getMovieDetails(id);

    return res.status(200).json({
      success: true,
      data: movieDetails
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener detalles de la película',
      error: error.message
    });
  }
};

/**
 * @desc    Crear nueva película basada en datos de TMDb
 * @route   POST /api/movies/tmdb
 * @access  Private
 */
exports.createMovieFromTmdb = async (req, res) => {
  try {
    const { tmdbId } = req.body;

    // Verificar si la película ya existe en nuestra BD
    const existingMovie = await Movie.findOne({ tmdbId });
    if (existingMovie) {
      return res.status(400).json({
        success: false,
        message: 'Esta película ya existe en nuestra base de datos',
        movieId: existingMovie._id
      });
    }

    // Obtener detalles de TMDb
    const movieDetails = await tmdbService.getMovieDetails(tmdbId);

    // Crear película en nuestra BD
    const movie = await Movie.create({
      ...movieDetails,
      createdBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear la película',
      error: error.message
    });
  }
};

/**
 * @desc    Crear nueva película manualmente
 * @route   POST /api/movies
 * @access  Private
 */
exports.createMovie = async (req, res) => {
  try {
    // Añadir usuario que crea la película
    req.body.createdBy = req.user._id;

    const movie = await Movie.create(req.body);

    return res.status(201).json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear la película',
      error: error.message
    });
  }
};

/**
 * @desc    Obtener todas las películas
 * @route   GET /api/movies
 * @access  Public
 */
exports.getMovies = async (req, res) => {
  try {
    // Construir consulta con filtros, ordenación, etc.
    let query = Movie.find();

    // Filtrado por género
    if (req.query.genre) {
      query = query.find({ genre: req.query.genre });
    }

    // Filtrado por año
    if (req.query.year) {
      query = query.find({ year: req.query.year });
    }

    // Búsqueda por título
    if (req.query.title) {
      query = query.find({ 
        title: { $regex: req.query.title, $options: 'i' } 
      });
    }

    // Ordenación
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Paginación
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Movie.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Ejecutar consulta
    const movies = await query;

    // Información de paginación
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    return res.status(200).json({
      success: true,
      count: movies.length,
      pagination,
      data: movies
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las películas',
      error: error.message
    });
  }
};

/**
 * @desc    Obtener película por ID
 * @route   GET /api/movies/:id
 * @access  Public
 */
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate('createdBy', 'name avatarUrl')
      .populate('watched', 'name avatarUrl')
      .populate('toWatch', 'name avatarUrl')
      .populate('favorites', 'name avatarUrl')
      .populate('ratings.user', 'name avatarUrl');

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Película no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener la película',
      error: error.message
    });
  }
};

/**
 * @desc    Actualizar película
 * @route   PUT /api/movies/:id
 * @access  Private
 */
exports.updateMovie = async (req, res) => {
  try {
    let movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Película no encontrada'
      });
    }

    // Verificar si el usuario es quien creó la película
    if (movie.createdBy && movie.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para actualizar esta película'
      });
    }

    movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar la película',
      error: error.message
    });
  }
};

/**
 * @desc    Eliminar película
 * @route   DELETE /api/movies/:id
 * @access  Private
 */
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Película no encontrada'
      });
    }

    // Verificar si el usuario es quien creó la película
    if (movie.createdBy && movie.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar esta película'
      });
    }

    // Si la película tiene un póster local, eliminarlo
    if (movie.posterUrl && movie.posterUrl.startsWith('/uploads')) {
      const posterPath = path.join(__dirname, '..', movie.posterUrl);
      if (fs.existsSync(posterPath)) {
        fs.unlinkSync(posterPath);
      }
    }

    await movie.deleteOne();

    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar la película',
      error: error.message
    });
  }
};

/**
 * @desc    Subir póster para película
 * @route   POST /api/movies/:id/poster
 * @access  Private
 */
exports.uploadMoviePoster = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ninguna imagen'
      });
    }

    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      // Eliminar el archivo subido si la película no existe
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'Película no encontrada'
      });
    }

    // Verificar si el usuario es quien creó la película
    if (movie.createdBy && movie.createdBy.toString() !== req.user._id.toString()) {
      // Eliminar el archivo subido si no tiene permisos
      fs.unlinkSync(req.file.path);
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para actualizar esta película'
      });
    }

    // Si ya existe un póster local, eliminar el anterior
    if (movie.posterUrl && movie.posterUrl.startsWith('/uploads')) {
      const oldPosterPath = path.join(__dirname, '..', movie.posterUrl);
      if (fs.existsSync(oldPosterPath)) {
        fs.unlinkSync(oldPosterPath);
      }
    }

    // Actualizar la URL del póster
    movie.posterUrl = `/uploads/posters/${req.file.filename}`;
    await movie.save();

    // Configurar cabeceras para evitar problemas CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

    // Añadir URL completa del servidor en entorno de producción con ruta de API para evitar CORS
    const apiPosterUrl = `/api/uploads/posters/${req.file.filename}`;
    const fullPosterUrl = process.env.NODE_ENV === 'production' 
      ? `${process.env.API_URL}${apiPosterUrl}`
      : apiPosterUrl;
    
    // Log de depuración
    console.log('API_URL:', process.env.API_URL);
    console.log('API Poster URL:', apiPosterUrl);
    console.log('Full Poster URL:', fullPosterUrl);

    return res.status(200).json({
      success: true,
      posterUrl: fullPosterUrl,
      message: 'Póster actualizado correctamente'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al subir el póster',
      error: error.message
    });
  }
};

/**
 * @desc    Marcar película como vista
 * @route   POST /api/movies/:id/watch
 * @access  Private
 */
exports.toggleWatchedStatus = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Película no encontrada'
      });
    }

    // Verificar si el usuario ya marcó la película como vista
    const isWatched = movie.watched.includes(req.user._id);

    // Actualizar lista de visualizaciones
    if (isWatched) {
      // Eliminar usuario de watched
      movie.watched = movie.watched.filter(
        userId => userId.toString() !== req.user._id.toString()
      );
    } else {
      // Añadir usuario a watched
      movie.watched.push(req.user._id);

      // Si estaba en toWatch, quitarla de ahí
      movie.toWatch = movie.toWatch.filter(
        userId => userId.toString() !== req.user._id.toString()
      );
    }

    await movie.save();

    return res.status(200).json({
      success: true,
      isWatched: !isWatched,
      message: isWatched ? 'Película desmarcada como vista' : 'Película marcada como vista'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el estado de visualización',
      error: error.message
    });
  }
};

/**
 * @desc    Marcar película para ver más tarde
 * @route   POST /api/movies/:id/to-watch
 * @access  Private
 */
exports.toggleToWatchStatus = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Película no encontrada'
      });
    }

    // Verificar si el usuario ya marcó la película para ver más tarde
    const isToWatch = movie.toWatch.includes(req.user._id);

    // Actualizar lista de películas por ver
    if (isToWatch) {
      // Eliminar usuario de toWatch
      movie.toWatch = movie.toWatch.filter(
        userId => userId.toString() !== req.user._id.toString()
      );
    } else {
      // Añadir usuario a toWatch
      movie.toWatch.push(req.user._id);

      // Si estaba en watched, quitarla de ahí
      movie.watched = movie.watched.filter(
        userId => userId.toString() !== req.user._id.toString()
      );
    }

    await movie.save();

    return res.status(200).json({
      success: true,
      isToWatch: !isToWatch,
      message: isToWatch ? 'Película eliminada de "Por Ver"' : 'Película añadida a "Por Ver"'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar la lista de películas por ver',
      error: error.message
    });
  }
};

/**
 * @desc    Marcar película como favorita
 * @route   POST /api/movies/:id/favorite
 * @access  Private
 */
exports.toggleFavoriteStatus = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Película no encontrada'
      });
    }

    // Verificar si el usuario ya marcó la película como favorita
    const isFavorite = movie.favorites.includes(req.user._id);

    // Actualizar lista de favoritos
    if (isFavorite) {
      // Eliminar usuario de favorites
      movie.favorites = movie.favorites.filter(
        userId => userId.toString() !== req.user._id.toString()
      );
    } else {
      // Añadir usuario a favorites
      movie.favorites.push(req.user._id);
    }

    await movie.save();

    return res.status(200).json({
      success: true,
      isFavorite: !isFavorite,
      message: isFavorite ? 'Película eliminada de favoritos' : 'Película añadida a favoritos'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar favoritos',
      error: error.message
    });
  }
};

/**
 * @desc    Añadir o actualizar valoración de película
 * @route   POST /api/movies/:id/rate
 * @access  Private
 */
exports.rateMovie = async (req, res) => {
  try {
    const { value, comment } = req.body;

    // Validar valor de la valoración
    if (!value || value < 1 || value > 5) {
      return res.status(400).json({
        success: false,
        message: 'La valoración debe ser un número entre 1 y 5'
      });
    }

    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Película no encontrada'
      });
    }

    // Buscar si el usuario ya valoró esta película
    const ratingIndex = movie.ratings.findIndex(
      rating => rating.user.toString() === req.user._id.toString()
    );

    if (ratingIndex > -1) {
      // Actualizar valoración existente
      movie.ratings[ratingIndex].value = value;
      if (comment !== undefined) {
        movie.ratings[ratingIndex].comment = comment;
      }
    } else {
      // Añadir nueva valoración
      movie.ratings.push({
        user: req.user._id,
        value,
        comment
      });
    }

    await movie.save();

    return res.status(200).json({
      success: true,
      averageRating: movie.getAverageRating(),
      message: 'Valoración guardada correctamente'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al guardar la valoración',
      error: error.message
    });
  }
};

/**
 * @desc    Eliminar valoración de película
 * @route   DELETE /api/movies/:id/rate
 * @access  Private
 */
exports.deleteRating = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Película no encontrada'
      });
    }

    // Eliminar la valoración del usuario actual
    movie.ratings = movie.ratings.filter(
      rating => rating.user.toString() !== req.user._id.toString()
    );

    await movie.save();

    return res.status(200).json({
      success: true,
      averageRating: movie.getAverageRating(),
      message: 'Valoración eliminada correctamente'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar la valoración',
      error: error.message
    });
  }
};
