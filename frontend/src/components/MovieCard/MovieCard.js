import './MovieCard.css';
import auth from '../../utils/auth.js';

export default class MovieCard {
  constructor(movie, router) {
    this.movie = movie;
    this.router = router;
    this.element = null;
  }
  
  render() {
    this.element = document.createElement('div');
    this.element.className = 'movie-card';
    this.element.dataset.id = this.movie._id || this.movie.id || '';
    
    // Contenido de la tarjeta
    const content = document.createElement('div');
    content.className = 'movie-card-content';
    
    // Póster
    const posterContainer = document.createElement('div');
    posterContainer.className = 'movie-card-poster';
    
    const poster = document.createElement('img');
    if (this.movie.posterUrl) {
      poster.src = this.movie.posterUrl.startsWith('http') 
        ? this.movie.posterUrl 
        : `http://localhost:5000${this.movie.posterUrl}`;
    } else if (this.movie.poster_path) {
      // Para resultados de búsqueda de TMDb
      poster.src = `https://image.tmdb.org/t/p/w500${this.movie.poster_path}`;
    } else {
      poster.src = '/placeholder.jpg';
    }
    poster.alt = `${this.movie.title} poster`;
    poster.loading = 'lazy';
    posterContainer.appendChild(poster);
    
    // Información
    const info = document.createElement('div');
    info.className = 'movie-card-info';
    
    // Título
    const title = document.createElement('h3');
    title.className = 'movie-card-title';
    title.textContent = this.movie.title;
    info.appendChild(title);
    
    // Año
    if (this.movie.year || this.movie.release_date) {
      const year = document.createElement('p');
      year.className = 'movie-card-year';
      year.textContent = this.movie.year || new Date(this.movie.release_date).getFullYear();
      info.appendChild(year);
    }
    
    // Géneros
    if (this.movie.genre && this.movie.genre.length > 0) {
      const genres = document.createElement('p');
      genres.className = 'movie-card-genres';
      genres.textContent = this.movie.genre.join(', ');
      info.appendChild(genres);
    } else if (this.movie.genres) {
      // Para resultados de TMDb
      const genres = document.createElement('p');
      genres.className = 'movie-card-genres';
      genres.textContent = this.movie.genres.map(g => g.name).join(', ');
      info.appendChild(genres);
    }
    
    // Valoración promedio si existe
    if (this.movie.ratings && this.movie.ratings.length > 0) {
      const rating = document.createElement('div');
      rating.className = 'movie-card-rating';
      
      const stars = document.createElement('span');
      stars.className = 'rating';
      stars.textContent = '★'.repeat(Math.round(this.getAverageRating()));
      rating.appendChild(stars);
      
      info.appendChild(rating);
    } else if (this.movie.vote_average) {
      // Para resultados de TMDb
      const rating = document.createElement('div');
      rating.className = 'movie-card-rating';
      
      const stars = document.createElement('span');
      stars.className = 'rating';
      const tmdbRating = this.movie.vote_average / 2; // TMDb usa escala 0-10
      stars.textContent = '★'.repeat(Math.round(tmdbRating));
      rating.appendChild(stars);
      
      info.appendChild(rating);
    }
    
    // Añadir al contenido
    content.appendChild(posterContainer);
    content.appendChild(info);
    
    this.element.appendChild(content);
    
    // Evento click para ir al detalle de la película
    this.element.addEventListener('click', () => {
      this.handleMovieClick();
    });
    
    return this.element;
  }
  
  // Calcular valoración promedio
  getAverageRating() {
    if (!this.movie.ratings || this.movie.ratings.length === 0) {
      return 0;
    }
    
    const sum = this.movie.ratings.reduce((acc, rating) => acc + rating.value, 0);
    return sum / this.movie.ratings.length;
  }
  
  handleMovieClick() {
    // Determinar el ID y tipo de película
    let id, isTmdb;
    
    if (this.movie._id) {
      id = this.movie._id;
      isTmdb = false;
    } else if (this.movie.id) {
      id = this.movie.id;
      isTmdb = true;
    } else {
      console.error('ID de película no encontrado');
      return;
    }
    
    // Navegar directamente a la página de detalles, sin importar el estado de autenticación
    if (isTmdb) {
      this.router.navigate(`/movie/tmdb/${id}`);
    } else {
      this.router.navigate(`/movie/${id}`);
    }
  }
} 