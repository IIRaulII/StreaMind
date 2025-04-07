import api from '../../services/api.js';
import MovieCard from '../../components/MovieCard/MovieCard.js';
import './Search.css';

export default class Search {
  constructor(router) {
    this.router = router;
    this.element = null;
    this.searchResults = [];
    this.isLoading = false;
  }
  
  render() {
    this.element = document.createElement('div');
    this.element.className = 'search-page';
    
    const container = document.createElement('div');
    container.className = 'container';
    
    // Título de la página
    const pageTitle = document.createElement('h1');
    pageTitle.className = 'page-title';
    pageTitle.textContent = 'Buscar Películas';
    container.appendChild(pageTitle);
    
    // Formulario de búsqueda
    const searchForm = document.createElement('form');
    searchForm.className = 'search-form';
    searchForm.id = 'search-form';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Buscar por título...';
    searchInput.id = 'search-input';
    searchInput.required = true;
    
    const searchButton = document.createElement('button');
    searchButton.type = 'submit';
    searchButton.className = 'action-button';
    searchButton.textContent = 'Buscar';
    
    searchForm.appendChild(searchInput);
    searchForm.appendChild(searchButton);
    container.appendChild(searchForm);
    
    // Contenedor de resultados
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results';
    resultsContainer.id = 'search-results';
    
    // Mensaje inicial
    const initialMessage = document.createElement('p');
    initialMessage.className = 'initial-message';
    initialMessage.textContent = 'Ingresa un título para buscar películas.';
    resultsContainer.appendChild(initialMessage);
    
    container.appendChild(resultsContainer);
    this.element.appendChild(container);
    
    // Agregar evento de búsqueda
    searchForm.addEventListener('submit', this.handleSearch.bind(this));
    
    return this.element;
  }
  
  async handleSearch(event) {
    event.preventDefault();
    
    const form = event.target;
    const searchInput = form.querySelector('#search-input');
    const query = searchInput.value.trim();
    
    if (!query) return;
    
    // Actualizar estado
    this.isLoading = true;
    this.updateSearchResultsUI();
    
    try {
      // Hacer petición a la API
      const response = await api.movies.search(query);
      this.searchResults = response.data || [];
      
      // Actualizar estado
      this.isLoading = false;
      this.updateSearchResultsUI();
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      
      // Actualizar estado con error
      this.isLoading = false;
      this.searchResults = [];
      this.updateSearchResultsUI(error.message || 'Error al buscar películas');
    }
  }
  
  updateSearchResultsUI(errorMessage = null) {
    const resultsContainer = document.getElementById('search-results');
    
    // Limpiar contenedor
    resultsContainer.innerHTML = '';
    
    // Mostrar loader si está cargando
    if (this.isLoading) {
      const loader = document.createElement('div');
      loader.className = 'loading';
      resultsContainer.appendChild(loader);
      return;
    }
    
    // Mostrar error si existe
    if (errorMessage) {
      const errorElement = document.createElement('p');
      errorElement.className = 'error-message';
      errorElement.textContent = errorMessage;
      resultsContainer.appendChild(errorElement);
      return;
    }
    
    // Mostrar mensaje si no hay resultados
    if (this.searchResults.length === 0) {
      const noResults = document.createElement('p');
      noResults.className = 'no-results';
      noResults.textContent = 'No se encontraron películas con ese título.';
      resultsContainer.appendChild(noResults);
      return;
    }
    
    // Título de resultados
    const resultsTitle = document.createElement('h2');
    resultsTitle.textContent = `Resultados (${this.searchResults.length})`;
    resultsContainer.appendChild(resultsTitle);
    
    // Grid para los resultados
    const resultsGrid = document.createElement('div');
    resultsGrid.className = 'movies-grid';
    
    // Renderizar cada película
    this.searchResults.forEach(movie => {
      const movieCard = new MovieCard(movie, this.router);
      resultsGrid.appendChild(movieCard.render());
    });
    
    // Información adicional
    const importInfo = document.createElement('p');
    importInfo.className = 'import-info';
    importInfo.textContent = 'Haz clic en una película para ver más detalles e importarla a tu colección.';
    
    resultsContainer.appendChild(resultsGrid);
    resultsContainer.appendChild(importInfo);
  }
} 