import api from '../../../services/api.js';
import auth from '../../../utils/auth.js';

export default class MovieEventHandler {
  constructor(component) {
    this.component = component;
    
    // Bind de los métodos para mantener el contexto
    this.handleBack = this.handleBack.bind(this);
    this.handleImportMovie = this.handleImportMovie.bind(this);
    this.handleToggleWatched = this.handleToggleWatched.bind(this);
    this.handleToggleToWatch = this.handleToggleToWatch.bind(this);
    this.handleToggleFavorite = this.handleToggleFavorite.bind(this);
    this.handleRating = this.handleRating.bind(this);
    this.handleSaveComment = this.handleSaveComment.bind(this);
  }
  
  handleBack() {
    window.history.back();
  }
  
  async handleImportMovie() {
    if (!auth.isAuthenticated()) {
      alert('Debes iniciar sesión para añadir películas a tu colección');
      this.component.router.navigate('/login');
      return;
    }
    
    try {
      const button = document.querySelector('.import-button');
      button.disabled = true;
      button.textContent = 'Añadiendo...';
      
      const response = await api.movies.createFromTmdb(this.component.id);
      
      // Navegar a la página de detalle de la película importada
      this.component.router.navigate(`/movie/${response.data._id}`);
    } catch (error) {
      console.error('Error al importar la película:', error);
      
      // Si la película ya existe, mostrar notificación en lugar de navegar automáticamente
      if (error.movieId) {
        import('../../../utils/notification.js').then(module => {
          const notification = module.default;
          notification.showInfo('Esta película ya existe en nuestra base de datos');
          
          // Añadir botón para navegar manualmente
          const importButtonContainer = document.querySelector('.import-button-container');
          if (importButtonContainer) {
            // Verificar si ya existe un botón "Ver en mi colección"
            const existingViewButton = importButtonContainer.querySelector('.view-collection-button');
            
            if (!existingViewButton) {
              // Ocultar el botón de importación
              const importButton = importButtonContainer.querySelector('.import-button');
              if (importButton) {
                importButton.style.display = 'none';
              }
              
              // Crear el botón "Ver en mi colección"
              const viewButton = document.createElement('button');
              viewButton.className = 'action-button view-collection-button';
              viewButton.textContent = 'Ver en mi colección';
              viewButton.addEventListener('click', () => {
                this.component.router.navigate(`/movie/${error.movieId}`);
              });
              
              importButtonContainer.appendChild(viewButton);
            }
          }
        });
      } else {
        // Restablecer el botón de importación solo para otros errores
        const button = document.querySelector('.import-button');
        if (button) {
          button.disabled = false;
          button.textContent = 'Añadir a mi colección';
        }
        
        // Usar el sistema de notificaciones para otros errores
        import('../../../utils/notification.js').then(module => {
          const notification = module.default;
          notification.showApiError(error);
        });
      }
    }
  }
  
  async handleToggleWatched() {
    if (!this.component.id || this.component.isTmdb) return;
    
    try {
      // Buscar el botón "Vista" dentro de nuestro componente usando un selector más específico
      const button = this.component.element.querySelector('.action-button:nth-child(1)');
      if (button) {
        button.disabled = true;
      }
      
      // Hacer la petición a la API
      const response = await api.movies.toggleWatched(this.component.id);
      
      // Actualizar estado local
      this.component.userState.isWatched = response.isWatched;
      
      // Si se marcó como vista, actualizar "Por Ver"
      if (response.isWatched) {
        this.component.userState.isToWatch = false;
      }
      
      // Actualizar UI
      this.component.renderMovie(false);
    } catch (error) {
      console.error('Error al cambiar estado de vista:', error);
      alert('Error al actualizar estado: ' + (error.message || 'Error desconocido'));
    }
  }
  
  async handleToggleToWatch() {
    if (!this.component.id || this.component.isTmdb) return;
    
    try {
      // Buscar el botón "Por Ver" dentro de nuestro componente
      const button = this.component.element.querySelector('.action-button:nth-child(2)');
      if (button) {
        button.disabled = true;
      }
      
      // Hacer la petición a la API
      const response = await api.movies.toggleToWatch(this.component.id);
      
      // Actualizar estado local
      this.component.userState.isToWatch = response.isToWatch;
      
      // Si se marcó como "Por Ver", actualizar "Vista"
      if (response.isToWatch) {
        this.component.userState.isWatched = false;
      }
      
      // Actualizar UI
      this.component.renderMovie(false);
    } catch (error) {
      console.error('Error al cambiar estado de por ver:', error);
      alert('Error al actualizar estado: ' + (error.message || 'Error desconocido'));
    }
  }
  
  async handleToggleFavorite() {
    if (!this.component.id || this.component.isTmdb) return;
    
    try {
      // Buscar el botón "Favorita" dentro de nuestro componente
      const button = this.component.element.querySelector('.action-button:nth-child(3)');
      if (button) {
        button.disabled = true;
      }
      
      // Hacer la petición a la API
      const response = await api.movies.toggleFavorite(this.component.id);
      
      // Actualizar estado local
      this.component.userState.isFavorite = response.isFavorite;
      
      // Actualizar UI
      this.component.renderMovie(false);
    } catch (error) {
      console.error('Error al cambiar estado de favorita:', error);
      alert('Error al actualizar estado: ' + (error.message || 'Error desconocido'));
    }
  }
  
  async handleRating(event) {
    if (!this.component.id || this.component.isTmdb) return;
    
    const ratingValue = parseInt(event.target.dataset.value);
    
    try {
      // Desactivar las estrellas temporalmente
      const stars = this.component.element.querySelectorAll('.star');
      stars.forEach(star => star.style.pointerEvents = 'none');
      
      // Hacer la petición a la API
      await api.movies.rate(this.component.id, {
        value: ratingValue
      });
      
      // Actualizar estado local
      this.component.userState.userRating = ratingValue;
      
      // Actualizar UI de las estrellas
      stars.forEach((star, index) => {
        const starValue = index + 1;
        star.textContent = starValue <= ratingValue ? '★' : '☆';
        star.style.pointerEvents = 'auto';
      });
    } catch (error) {
      console.error('Error al valorar película:', error);
      alert('Error al guardar valoración: ' + (error.message || 'Error desconocido'));
      
      // Reactivar estrellas
      const stars = this.component.element.querySelectorAll('.star');
      stars.forEach(star => star.style.pointerEvents = 'auto');
    }
  }
  
  async handleSaveComment() {
    if (!this.component.id || this.component.isTmdb) return;
    
    const commentTextarea = this.component.element.querySelector('#movie-comment');
    if (!commentTextarea) return;
    
    const comment = commentTextarea.value.trim();
    
    try {
      // Desactivar botón temporalmente
      const button = this.component.element.querySelector('.comment-container button');
      if (button) {
        button.disabled = true;
        button.textContent = 'Guardando...';
      }
      
      // Si no hay valoración, ponemos un valor por defecto
      const ratingValue = this.component.userState.userRating || 3;
      
      // Hacer la petición a la API
      await api.movies.rate(this.component.id, {
        value: ratingValue,
        comment
      });
      
      // Reactivar botón y mostrar confirmación
      if (button) {
        button.disabled = false;
        button.textContent = 'Guardado';
        
        setTimeout(() => {
          if (button) button.textContent = 'Guardar comentario';
        }, 2000);
      }
    } catch (error) {
      console.error('Error al guardar comentario:', error);
      alert('Error al guardar comentario: ' + (error.message || 'Error desconocido'));
      
      // Reactivar botón
      const button = this.component.element.querySelector('.comment-container button');
      if (button) {
        button.disabled = false;
        button.textContent = 'Guardar comentario';
      }
    }
  }
  
  // Método para obtener todos los handlers como un objeto
  getHandlers() {
    return {
      onBack: this.handleBack,
      onImportMovie: this.handleImportMovie,
      onToggleWatched: this.handleToggleWatched,
      onToggleToWatch: this.handleToggleToWatch,
      onToggleFavorite: this.handleToggleFavorite,
      onRating: this.handleRating,
      onSaveComment: this.handleSaveComment
    };
  }
} 