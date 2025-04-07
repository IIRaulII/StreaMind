import './ImportTmdbMovie.css';
import auth from '../../../utils/auth.js';

export default class ImportTmdbMovie {
  constructor(movieId, handlers, router) {
    this.movieId = movieId;
    this.handlers = handlers;
    this.router = router;
    this.element = null;
  }
  
  render() {
    this.element = document.createElement('div');
    this.element.className = 'import-section';
    
    // Solo mostrar botón de importación si el usuario está autenticado
    if (auth.isAuthenticated()) {
      const importButtonContainer = document.createElement('div');
      importButtonContainer.className = 'import-button-container';
      
      const importButton = document.createElement('button');
      importButton.className = 'import-button';
      importButton.textContent = 'Añadir a mi colección';
      importButton.addEventListener('click', this.handlers.onImportMovie);
      
      importButtonContainer.appendChild(importButton);
      this.element.appendChild(importButtonContainer);
    } else {
      // Mostrar mensaje indicando que debe iniciar sesión para importar
      const loginSection = document.createElement('div');
      loginSection.className = 'login-section';
      
      const loginMessage = document.createElement('p');
      loginMessage.className = 'login-message';
      loginMessage.textContent = 'Inicia sesión para añadir a tu colección';
      
      const loginButton = document.createElement('button');
      loginButton.className = 'login-button';
      loginButton.textContent = 'Iniciar sesión';
      loginButton.addEventListener('click', () => {
        this.router.navigate('/login');
      });
      
      loginSection.appendChild(loginMessage);
      loginSection.appendChild(loginButton);
      this.element.appendChild(loginSection);
    }
    
    return this.element;
  }
} 