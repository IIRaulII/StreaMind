//Este archivo componente se ha modificado en subcomponentes porque era demasido grande y no se podia manejar bien
import './MovieDetail.css';
import MovieDetailContent from './components/MovieDetailContent.js';
import LoadingIndicator from './components/LoadingIndicator.js';
import ErrorSection from './components/ErrorSection.js';
import MovieStateManager from './state/MovieStateManager.js';
import MovieEventHandler from './handlers/MovieEventHandler.js';

export default class MovieDetail {
  constructor(router, id, isTmdb = false) {
    this.router = router;
    this.id = id;
    this.isTmdb = isTmdb;
    this.element = null;
    
    // Componentes
    this.loadingIndicator = new LoadingIndicator();
    this.errorSection = new ErrorSection(router);
    
    // Gestor de estado
    this.stateManager = new MovieStateManager(this);
    
    // Manejador de eventos
    this.eventHandler = new MovieEventHandler(this);
    
    // Acceso directo al estado
    this.movie = this.stateManager.movie;
    this.isLoading = this.stateManager.isLoading;
    this.error = this.stateManager.error;
    this.userState = this.stateManager.userState;
  }
  
  async render() {
    this.element = document.createElement('div');
    this.element.className = 'movie-detail-page';
    
    const container = document.createElement('div');
    container.className = 'container';
    
    // Sección de carga
    container.appendChild(this.loadingIndicator.render());
    
    // Sección de error (oculta inicialmente)
    container.appendChild(this.errorSection.render());
    
    // Contenedor principal de la película (oculto inicialmente)
    const movieContainer = document.createElement('div');
    movieContainer.className = 'movie-container hidden';
    movieContainer.id = 'movie-container';
    container.appendChild(movieContainer);
    
    this.element.appendChild(container);
    
    // Cargar los datos de la película
    setTimeout(() => {
      this.stateManager.loadMovieData();
    }, 0);
    
    return this.element;
  }
  
  renderMovie(isExternal) {
    // Actualizar referencias a estados
    this.movie = this.stateManager.movie;
    this.isLoading = this.stateManager.isLoading;
    this.error = this.stateManager.error;
    this.userState = this.stateManager.userState;
    
    // Actualizar estado UI
    this.updateUI();
    
    // Obtener el contenedor
    const movieContainer = this.element.querySelector('#movie-container');
    if (!movieContainer) {
      console.error('No se encontró el contenedor de la película');
      return;
    }
    
    // Limpiar contenedor
    movieContainer.innerHTML = '';
    
    // Renderizar el componente de contenido principal
    const movieDetailContent = new MovieDetailContent(
      this.movie,
      this.userState,
      this.eventHandler.getHandlers(),
      this.router,
      isExternal
    );
    
    movieContainer.appendChild(movieDetailContent.render());
  }
  
  updateUI() {
    // Verificar que el elemento principal esté en el DOM
    if (!this.element || !this.element.isConnected) {
      console.warn('El componente MovieDetail no está conectado al DOM');
      return;
    }
    
    // Buscar elementos dentro de nuestro propio componente para evitar conflictos
    const loadingIndicator = this.element.querySelector('#loading-indicator');
    const errorSection = this.element.querySelector('#error-section');
    const movieContainer = this.element.querySelector('#movie-container');
    
    // Verificar que los elementos existan antes de manipularlos
    if (!loadingIndicator || !errorSection || !movieContainer) {
      console.warn('Elementos del DOM no encontrados en updateUI. La página podría haber cambiado.');
      return;
    }
    
    if (this.isLoading) {
      this.loadingIndicator.show();
      this.errorSection.hide();
      
      movieContainer.classList.add('hidden');
      movieContainer.style.display = 'none';
    } else if (this.error) {
      this.loadingIndicator.hide();
      this.errorSection.setErrorMessage(this.error);
      this.errorSection.show();
      
      movieContainer.classList.add('hidden');
      movieContainer.style.display = 'none';
    } else {
      this.loadingIndicator.hide();
      this.errorSection.hide();
      
      movieContainer.classList.remove('hidden');
      movieContainer.style.display = 'block';
    }
  }
} 