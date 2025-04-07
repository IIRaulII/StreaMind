import './MovieDetailContent.css';
import MovieHeader from './MovieHeader.js';
import MoviePoster from './MoviePoster.js';
import MovieInfo from './MovieInfo.js';
import UserActions from './UserActions.js';
import RatingSystem from './RatingSystem.js';
import CommunityRatings from './CommunityRatings.js';
import ImportTmdbMovie from './ImportTmdbMovie.js';
import LoginPrompt from './LoginPrompt.js';
import auth from '../../../utils/auth.js';

export default class MovieDetailContent {
  constructor(movie, userState, handlers, router, isExternal = false) {
    this.movie = movie;
    this.userState = userState;
    this.handlers = handlers;
    this.router = router;
    this.isExternal = isExternal;
    this.element = null;
  }
  
  render() {
    this.element = document.createElement('div');
    this.element.className = 'movie-container';
    
    // Header con título, año y géneros
    const movieHeader = new MovieHeader(this.movie, this.handlers.onBack);
    this.element.appendChild(movieHeader.render());
    
    // Contenido principal (poster + detalles)
    const movieContent = document.createElement('div');
    movieContent.className = 'movie-content';
    
    // Póster
    const moviePoster = new MoviePoster(this.movie);
    movieContent.appendChild(moviePoster.render());
    
    // Sección de detalles
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'details-container';
    
    // Información básica y sinopsis
    const movieInfo = new MovieInfo(this.movie);
    detailsContainer.appendChild(movieInfo.render());
    
    // Si es una película externa, mostrar botón para importar
    if (this.isExternal) {
      const importTmdbMovie = new ImportTmdbMovie(
        this.movie.id, 
        { onImportMovie: this.handlers.onImportMovie },
        this.router
      );
      detailsContainer.appendChild(importTmdbMovie.render());
    } 
    // Si es película de nuestra colección y el usuario está autenticado
    else if (auth.isAuthenticated()) {
      // Acciones del usuario (marcar como vista, por ver, favorita)
      const userActions = new UserActions(
        this.movie, 
        this.userState,
        {
          onToggleWatched: this.handlers.onToggleWatched,
          onToggleToWatch: this.handlers.onToggleToWatch,
          onToggleFavorite: this.handlers.onToggleFavorite
        }
      );
      detailsContainer.appendChild(userActions.render());
      
      // Sistema de valoración
      const ratingSystem = new RatingSystem(
        this.movie,
        this.userState,
        {
          onRating: this.handlers.onRating,
          onSaveComment: this.handlers.onSaveComment
        }
      );
      detailsContainer.appendChild(ratingSystem.render());
    } 
    // Si no está autenticado y no es película externa
    else if (!this.isExternal) {
      // Mostrar prompt de inicio de sesión
      const loginPrompt = new LoginPrompt(this.router);
      detailsContainer.appendChild(loginPrompt.render());
    }
    
    movieContent.appendChild(detailsContainer);
    this.element.appendChild(movieContent);
    
    // Sección de valoraciones de la comunidad
    if (!this.isExternal) {
      const communityRatings = new CommunityRatings(this.movie);
      const ratingsElement = communityRatings.render();
      if (ratingsElement) {
        this.element.appendChild(ratingsElement);
      }
    }
    
    return this.element;
  }
} 