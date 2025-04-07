import api from '../../../services/api.js';
import auth from '../../../utils/auth.js';

export default class MovieStateManager {
  constructor(component) {
    this.component = component;
    this.movie = null;
    this.isLoading = true;
    this.error = null;
    this.userState = {
      userId: auth.isAuthenticated() ? auth.getUser()._id : null,
      isWatched: false,
      isToWatch: false,
      isFavorite: false,
      userRating: 0
    };
  }
  
  async loadMovieData() {
    // Asegurarse de iniciar en estado de carga
    this.isLoading = true;
    this.error = null;
    this.component.updateUI();
    
    try {
      if (this.component.isTmdb) {
        await this.loadTmdbMovie();
      } else {
        await this.loadLocalMovie();
      }
    } catch (error) {
      console.error('Error al cargar la película:', error);
      this.isLoading = false;
      this.error = error.message || 'Error al cargar los detalles de la película';
      this.component.updateUI();
    }
  }
  
  async loadTmdbMovie() {
    // Cargar detalles de TMDB directamente sin necesitar autenticación
    const response = await api.movies.getTmdbDetails(this.component.id);
    
    // Verificar si tenemos datos válidos antes de renderizar
    if (response && response.data) {
      this.movie = response.data;
      this.isLoading = false;
      // Añadir botón para importar solo si el usuario está autenticado
      this.component.renderMovie(true);
    } else {
      throw new Error('No se pudo obtener información de la película desde TMDB');
    }
  }
  
  async loadLocalMovie() {
    // Cargar detalles de nuestra base de datos
    const response = await api.movies.getById(this.component.id);
    
    if (!response || !response.data) {
      throw new Error('No se encontró la película solicitada');
    }
    
    this.movie = response.data;
    
    // Verificar si el usuario está autenticado para obtener sus estados
    if (auth.isAuthenticated()) {
      await this.loadUserStates();
    }
    
    this.isLoading = false;
    this.component.renderMovie(false);
  }
  
  async loadUserStates() {
    const user = auth.getUser();
    
    // Verificar estado de "vista"
    this.userState.isWatched = this.movie.watched && 
      this.movie.watched.some(watchedUser => {
        // Comparar IDs como strings ya que pueden llegar como objetos o strings
        const watchedId = typeof watchedUser === 'object' && watchedUser._id ? watchedUser._id : watchedUser;
        return watchedId.toString() === user._id.toString();
      });
    
    // Verificar estado de "por ver"
    this.userState.isToWatch = this.movie.toWatch && 
      this.movie.toWatch.some(toWatchUser => {
        // Comparar IDs como strings ya que pueden llegar como objetos o strings
        const toWatchId = typeof toWatchUser === 'object' && toWatchUser._id ? toWatchUser._id : toWatchUser;
        return toWatchId.toString() === user._id.toString();
      });
    
    // Verificar estado de "favorita"
    this.userState.isFavorite = this.movie.favorites && 
      this.movie.favorites.some(favoriteUser => {
        // Comparar IDs como strings ya que pueden llegar como objetos o strings
        const favoriteId = typeof favoriteUser === 'object' && favoriteUser._id ? favoriteUser._id : favoriteUser;
        return favoriteId.toString() === user._id.toString();
      });
    
    // Verificar valoración del usuario
    const userRating = this.movie.ratings && 
      this.movie.ratings.find(rating => {
        const ratingUserId = typeof rating.user === 'object' && rating.user._id ? rating.user._id : rating.user;
        return ratingUserId.toString() === user._id.toString();
      });
    
    if (userRating) {
      this.userState.userRating = userRating.value;
    }
  }
  
  // Método para obtener estado actual
  getState() {
    return {
      movie: this.movie,
      isLoading: this.isLoading,
      error: this.error,
      userState: this.userState
    };
  }
} 