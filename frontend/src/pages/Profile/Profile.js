import api from '../../services/api.js';
import auth from '../../utils/auth.js';
import MovieCard from '../../components/MovieCard/MovieCard.js';
import './Profile.css';

export default class Profile {
  constructor(router) {
    this.router = router;
    this.element = null;
    this.user = auth.getUser();
    this.movies = {
      watched: [],
      toWatch: [],
      favorites: []
    };
    this.activeTab = 'watched';
  }
  
  async render() {
    // Redireccionar si no está autenticado
    if (!auth.requireAuth(this.router)) {
      return document.createElement('div'); // Return empty div
    }
    
    this.element = document.createElement('div');
    this.element.className = 'profile-page';
    
    const container = document.createElement('div');
    container.className = 'container';
    
    // Información del usuario
    const userInfo = document.createElement('div');
    userInfo.className = 'user-info';
    
    // Avatar
    const avatarContainer = document.createElement('div');
    avatarContainer.className = 'avatar-container';
    
    if (this.user.avatarUrl && this.user.avatarUrl !== '/assets/default-avatar.png') {
      // Si hay un avatar personalizado, mostrarlo
      const avatar = document.createElement('img');
      avatar.src = this.user.avatarUrl.startsWith('http') 
        ? this.user.avatarUrl 
        : `${import.meta.env.VITE_API_URL}${this.user.avatarUrl}`;
      avatar.alt = 'Avatar del usuario';
      avatarContainer.appendChild(avatar);
    } else {
      // Si no hay avatar, mostrar la inicial del usuario
      const initialAvatar = document.createElement('div');
      initialAvatar.className = 'initial-avatar';
      initialAvatar.textContent = this.user.name.charAt(0).toUpperCase();
      avatarContainer.appendChild(initialAvatar);
    }
    
    // Botón para subir avatar (mejorado)
    const uploadAvatarBtn = document.createElement('div');
    uploadAvatarBtn.className = 'upload-avatar-btn';
    uploadAvatarBtn.innerHTML = '<i class="fas fa-camera"></i><span>Cambiar</span>';
    
    const uploadAvatarInput = document.createElement('input');
    uploadAvatarInput.type = 'file';
    uploadAvatarInput.id = 'avatar-upload';
    uploadAvatarInput.accept = 'image/*';
    uploadAvatarInput.style.display = 'none';
    uploadAvatarInput.addEventListener('change', this.handleAvatarUpload.bind(this));
    
    uploadAvatarBtn.addEventListener('click', () => {
      uploadAvatarInput.click();
    });
    
    avatarContainer.appendChild(uploadAvatarBtn);
    avatarContainer.appendChild(uploadAvatarInput);
    
    // Datos del usuario
    const userData = document.createElement('div');
    userData.className = 'user-data';
    
    const userName = document.createElement('h1');
    userName.textContent = this.user.name;
    
    const userEmail = document.createElement('p');
    userEmail.textContent = this.user.email;
    
    userData.appendChild(userName);
    userData.appendChild(userEmail);
    
    userInfo.appendChild(avatarContainer);
    userInfo.appendChild(userData);
    
    container.appendChild(userInfo);
    
    // Sección de películas
    const moviesSection = document.createElement('div');
    moviesSection.className = 'movies-section';
    
    // Tabs para categorías de películas
    const tabs = document.createElement('div');
    tabs.className = 'tabs';
    
    const watchedTab = document.createElement('button');
    watchedTab.textContent = 'Vistas';
    watchedTab.className = 'tab active';
    watchedTab.dataset.tab = 'watched';
    watchedTab.addEventListener('click', () => this.changeTab('watched'));
    
    const toWatchTab = document.createElement('button');
    toWatchTab.textContent = 'Por Ver';
    toWatchTab.className = 'tab';
    toWatchTab.dataset.tab = 'toWatch';
    toWatchTab.addEventListener('click', () => this.changeTab('toWatch'));
    
    const favoritesTab = document.createElement('button');
    favoritesTab.textContent = 'Favoritas';
    favoritesTab.className = 'tab';
    favoritesTab.dataset.tab = 'favorites';
    favoritesTab.addEventListener('click', () => this.changeTab('favorites'));
    
    tabs.appendChild(watchedTab);
    tabs.appendChild(toWatchTab);
    tabs.appendChild(favoritesTab);
    
    moviesSection.appendChild(tabs);
    
    // Contenedor para las películas
    const moviesContainer = document.createElement('div');
    moviesContainer.className = 'tab-content';
    moviesContainer.id = 'movies-container';
    
    // Loading indicator
    const loading = document.createElement('div');
    loading.className = 'loading';
    moviesContainer.appendChild(loading);
    
    moviesSection.appendChild(moviesContainer);
    container.appendChild(moviesSection);
    
    this.element.appendChild(container);
    
    // Cargar películas
    this.loadUserMovies();
    
    return this.element;
  }
  
  async loadUserMovies() {
    try {
      // Obtener todas las películas
      const response = await api.movies.getAll();
      const allMovies = response.data;
      
      // Filtrar por películas que el usuario ha visto
      this.movies.watched = allMovies.filter(movie => 
        movie.watched && movie.watched.includes(this.user._id)
      );
      
      // Filtrar por películas que el usuario quiere ver
      this.movies.toWatch = allMovies.filter(movie => 
        movie.toWatch && movie.toWatch.includes(this.user._id)
      );
      
      // Filtrar por películas favoritas del usuario
      this.movies.favorites = allMovies.filter(movie => 
        movie.favorites && movie.favorites.includes(this.user._id)
      );
      
      // Actualizar la interfaz con las películas de la categoría actual
      this.updateMoviesUI();
    } catch (error) {
      console.error('Error al cargar películas del usuario:', error);
      this.showErrorMessage('Error al cargar tus películas');
    }
  }
  
  updateMoviesUI() {
    const moviesContainer = document.getElementById('movies-container');
    if (!moviesContainer) return;
    
    // Limpiar contenedor
    moviesContainer.innerHTML = '';
    
    const currentMovies = this.movies[this.activeTab];
    
    // Verificar si hay películas en esta categoría
    if (currentMovies.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.className = 'empty-message';
      
      switch (this.activeTab) {
        case 'watched':
          emptyMessage.textContent = 'No has marcado ninguna película como vista.';
          break;
        case 'toWatch':
          emptyMessage.textContent = 'No has añadido películas para ver más tarde.';
          break;
        case 'favorites':
          emptyMessage.textContent = 'No has marcado películas como favoritas.';
          break;
      }
      
      moviesContainer.appendChild(emptyMessage);
      return;
    }
    
    // Grid para las películas
    const moviesGrid = document.createElement('div');
    moviesGrid.className = 'movies-grid';
    
    // Renderizar cada película
    currentMovies.forEach(movie => {
      const movieCard = new MovieCard(movie, this.router);
      moviesGrid.appendChild(movieCard.render());
    });
    
    moviesContainer.appendChild(moviesGrid);
  }
  
  changeTab(tabName) {
    this.activeTab = tabName;
    
    // Actualizar clases de las pestañas
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      if (tab.dataset.tab === tabName) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    // Actualizar la lista de películas
    this.updateMoviesUI();
  }
  
  showErrorMessage(message) {
    const moviesContainer = document.getElementById('movies-container');
    if (!moviesContainer) return;
    
    // Limpiar contenedor
    moviesContainer.innerHTML = '';
    
    // Mostrar mensaje de error
    const errorMessage = document.createElement('p');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    moviesContainer.appendChild(errorMessage);
  }
  
  async handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Verificar que sea una imagen
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecciona un archivo de imagen válido.');
      return;
    }
    
    try {
      // Crear FormData para enviar el archivo
      const formData = new FormData();
      formData.append('avatar', file);
      
      // Mostrar estado de carga
      const avatarContainer = this.element.querySelector('.avatar-container');
      if (!avatarContainer) return;
      
      // Aplicar opacidad para indicar carga
      avatarContainer.style.opacity = '0.7';
      
      // Enviar a la API
      const response = await api.users.uploadAvatar(formData);
      
      // Actualizar avatar en la interfaz
      if (response.avatarUrl) {
        // Si teníamos un avatar con inicial, reemplazarlo con imagen
        const initialAvatar = avatarContainer.querySelector('.initial-avatar');
        if (initialAvatar) {
          // Eliminar el avatar inicial
          initialAvatar.remove();
          
          // Crear el nuevo elemento de imagen
          const newAvatar = document.createElement('img');
          newAvatar.src = response.avatarUrl.startsWith('http') 
            ? response.avatarUrl 
            : `${import.meta.env.VITE_API_URL}${response.avatarUrl}`;
          newAvatar.alt = 'Avatar del usuario';
          
          // Insertarlo antes del botón de subida
          const uploadBtn = avatarContainer.querySelector('.upload-avatar-btn');
          avatarContainer.insertBefore(newAvatar, uploadBtn);
        } else {
          // Si ya tenemos una imagen, solo actualizar la URL
          const avatar = avatarContainer.querySelector('img');
          if (avatar) {
            avatar.src = response.avatarUrl.startsWith('http') 
              ? response.avatarUrl 
              : `${import.meta.env.VITE_API_URL}${response.avatarUrl}`;
          }
        }
        
        // Actualizar usuario en el estado
        this.user = auth.getUser();
      }
      
      // Restaurar opacidad
      avatarContainer.style.opacity = '1';
    } catch (error) {
      console.error('Error al subir avatar:', error);
      alert('Error al subir el avatar. Inténtalo de nuevo.');
      
      // Restaurar opacidad
      const avatarContainer = this.element.querySelector('.avatar-container');
      if (avatarContainer) avatarContainer.style.opacity = '1';
    }
  }
} 