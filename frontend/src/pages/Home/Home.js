import api from '../../services/api.js';
import MovieCard from '../../components/MovieCard/MovieCard.js';
import './Home.css';
import auth from '../../utils/auth.js';

export default class Home {
  constructor(router) {
    this.router = router;
    this.element = null;
    this.movies = [];
  }
  
  async render() {
    this.element = document.createElement('div');
    this.element.className = 'home-page';
    
    // Contenedor principal
    const container = document.createElement('div');
    container.className = 'container';
    
    // Sección hero
    const heroSection = document.createElement('section');
    heroSection.className = 'hero';
    
    const heroContent = document.createElement('div');
    heroContent.className = 'hero-content';
    
    const heroTitle = document.createElement('h1');
    heroTitle.textContent = 'StreaMind';
    
    const heroSubtitle = document.createElement('p');
    heroSubtitle.textContent = 'Tu memoria digital de películas';
    
    const heroActions = document.createElement('div');
    heroActions.className = 'hero-actions';
    
    const searchButton = document.createElement('button');
    searchButton.textContent = 'Buscar Películas';
    searchButton.addEventListener('click', () => {
      this.router.navigate('/search');
    });
    
    // Añadir el botón para crear películas si el usuario está autenticado
    if (auth.isAuthenticated()) {
      const createButton = document.createElement('button');
      createButton.textContent = 'Añadir Película';
      createButton.addEventListener('click', () => {
        this.router.navigate('/movie/create');
      });
      heroActions.appendChild(createButton);
    }
    
    heroActions.appendChild(searchButton);
    heroContent.appendChild(heroTitle);
    heroContent.appendChild(heroSubtitle);
    heroContent.appendChild(heroActions);
    heroSection.appendChild(heroContent);
    
    container.appendChild(heroSection);
    
    // Sección de películas recientes
    const moviesSection = document.createElement('section');
    moviesSection.className = 'movies-section';
    
    const sectionTitle = document.createElement('h2');
    sectionTitle.textContent = 'Películas Recientes';
    moviesSection.appendChild(sectionTitle);
    
    const moviesList = document.createElement('div');
    moviesList.className = 'movies-grid';
    moviesList.id = 'movies-list';
    
    // Loading indicator
    const loading = document.createElement('div');
    loading.className = 'loading';
    moviesList.appendChild(loading);
    
    moviesSection.appendChild(moviesList);
    container.appendChild(moviesSection);
    
    this.element.appendChild(container);
    
    // Cargar películas después de renderizar
    this.loadMovies();
    
    return this.element;
  }
  
  async loadMovies() {
    try {
      const response = await api.movies.getAll({ limit: 20 });
      this.movies = response.data;
      
      // Obtener el contenedor de la lista de películas
      const moviesList = document.getElementById('movies-list');
      
      // Limpiar el contenedor
      moviesList.innerHTML = '';
      
      // Verificar si hay películas
      if (this.movies.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'No hay películas disponibles.';
        moviesList.appendChild(emptyMessage);
        return;
      }
      
      // Renderizar cada película
      this.movies.forEach(movie => {
        const movieCard = new MovieCard(movie, this.router);
        moviesList.appendChild(movieCard.render());
      });
    } catch (error) {
      console.error('Error al cargar películas:', error);
      
      // Mostrar mensaje de error
      const moviesList = document.getElementById('movies-list');
      moviesList.innerHTML = '';
      
      const errorMessage = document.createElement('p');
      errorMessage.className = 'error-message';
      errorMessage.textContent = 'Error al cargar películas. Inténtalo de nuevo más tarde.';
      moviesList.appendChild(errorMessage);
    }
  }
} 