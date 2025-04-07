const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Por favor, introduce el título de la película'],
    trim: true,
    maxlength: [100, 'El título no puede tener más de 100 caracteres']
  },
  year: {
    type: Number,
    required: [true, 'Por favor, introduce el año de la película']
  },
  genre: {
    type: [String],
    required: [true, 'Por favor, introduce al menos un género']
  },
  synopsis: {
    type: String,
    required: false,
    default: 'Sin sinopsis disponible.',
    maxlength: [2000, 'La sinopsis no puede tener más de 2000 caracteres']
  },
  posterUrl: {
    type: String,
    default: ''
  },
  tmdbId: {
    type: String,
    unique: true,
    sparse: true // Permite valores nulos o ausentes
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  watched: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  toWatch: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  ratings: [ratingSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Método para calcular la valoración media
movieSchema.methods.getAverageRating = function() {
  if (this.ratings.length === 0) {
    return 0;
  }
  
  const sum = this.ratings.reduce((acc, rating) => acc + rating.value, 0);
  return (sum / this.ratings.length).toFixed(1);
};

module.exports = mongoose.model('Movie', movieSchema);
