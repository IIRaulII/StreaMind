import './UserActions.css';

export default class UserActions {
  constructor(movie, userState, handlers, isExternal = false) {
    this.movie = movie;
    this.userState = userState;
    this.handlers = handlers;
    this.isExternal = isExternal;
    this.element = null;
  }
  
  render() {
    if (this.isExternal) {
      return null;
    }
    
    this.element = document.createElement('div');
    this.element.className = 'actions-container';
    
    // Título de acciones
    const actionsTitle = document.createElement('h3');
    actionsTitle.textContent = 'Acciones';
    this.element.appendChild(actionsTitle);
    
    // Contenedor de botones
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';
    
    // Botón Vista
    const watchedButton = document.createElement('button');
    watchedButton.className = this.userState.isWatched ? 'action-button active' : 'action-button';
    watchedButton.innerHTML = this.userState.isWatched ? '✓ Vista' : 'Marcar como vista';
    watchedButton.addEventListener('click', this.handlers.onToggleWatched);
    buttonGroup.appendChild(watchedButton);
    
    // Botón Por Ver
    const toWatchButton = document.createElement('button');
    toWatchButton.className = this.userState.isToWatch ? 'action-button active' : 'action-button';
    toWatchButton.innerHTML = this.userState.isToWatch ? '✓ Por Ver' : 'Añadir a Por Ver';
    toWatchButton.addEventListener('click', this.handlers.onToggleToWatch);
    buttonGroup.appendChild(toWatchButton);
    
    // Botón Favorita
    const favoriteButton = document.createElement('button');
    favoriteButton.className = this.userState.isFavorite ? 'action-button active' : 'action-button';
    favoriteButton.innerHTML = this.userState.isFavorite ? '★ Favorita' : 'Añadir a Favoritas';
    favoriteButton.addEventListener('click', this.handlers.onToggleFavorite);
    buttonGroup.appendChild(favoriteButton);
    
    this.element.appendChild(buttonGroup);
    
    return this.element;
  }
} 