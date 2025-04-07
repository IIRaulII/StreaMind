import './CommunityRatings.css';
import auth from '../../../utils/auth.js';

export default class CommunityRatings {
  constructor(movie) {
    this.movie = movie;
    this.element = null;
  }
  
  render() {
    // Si no hay valoraciones o el componente es para una película externa, no mostrar nada
    if (!this.movie.ratings || this.movie.ratings.length === 0) {
      return null;
    }
    
    this.element = document.createElement('div');
    this.element.className = 'ratings-section';
    
    const ratingsTitle = document.createElement('h2');
    ratingsTitle.textContent = 'Valoraciones de la comunidad';
    this.element.appendChild(ratingsTitle);
    
    const ratingsList = document.createElement('div');
    ratingsList.className = 'ratings-list';
    
    // Filtrar valoraciones del usuario actual si está autenticado
    const currentUserId = auth.isAuthenticated() ? auth.getUser()._id : null;
    
    // Mostrar valoraciones de otros usuarios
    this.movie.ratings.forEach(rating => {
      // Si es el usuario actual, no mostrar
      if (currentUserId) {
        const ratingUserId = typeof rating.user === 'object' && rating.user._id 
          ? rating.user._id 
          : rating.user;
          
        if (ratingUserId.toString() === currentUserId.toString()) {
          return;
        }
      }
      
      const ratingItem = document.createElement('div');
      ratingItem.className = 'rating-item';
      
      const ratingHeader = document.createElement('div');
      ratingHeader.className = 'rating-header';
      
      const userName = document.createElement('span');
      userName.className = 'user-name';
      // Extraer nombre de usuario dependiendo de la estructura de datos
      if (typeof rating.user === 'object' && rating.user.name) {
        userName.textContent = rating.user.name;
      } else {
        userName.textContent = 'Usuario';
      }
      
      const ratingValue = document.createElement('span');
      ratingValue.className = 'rating-value';
      ratingValue.textContent = '★'.repeat(rating.value) + '☆'.repeat(5 - rating.value);
      
      ratingHeader.appendChild(userName);
      ratingHeader.appendChild(ratingValue);
      
      const ratingComment = document.createElement('p');
      ratingComment.className = 'rating-comment';
      ratingComment.textContent = rating.comment || 'Sin comentario';
      
      ratingItem.appendChild(ratingHeader);
      ratingItem.appendChild(ratingComment);
      
      ratingsList.appendChild(ratingItem);
    });
    
    this.element.appendChild(ratingsList);
    
    return this.element;
  }
} 