import './RatingSystem.css';

export default class RatingSystem {
  constructor(movie, userState, handlers) {
    this.movie = movie;
    this.userState = userState;
    this.handlers = handlers;
    this.element = null;
  }
  
  render() {
    this.element = document.createElement('div');
    this.element.className = 'rating-container';
    
    const ratingTitle = document.createElement('h3');
    ratingTitle.textContent = 'Tu valoración';
    this.element.appendChild(ratingTitle);
    
    // Contenedor de estrellas
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-container';
    
    // Crear 5 estrellas para valoración
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.className = 'star';
      star.textContent = i <= this.userState.userRating ? '★' : '☆';
      star.dataset.value = i;
      star.addEventListener('click', this.handlers.onRating);
      starsContainer.appendChild(star);
    }
    
    this.element.appendChild(starsContainer);
    
    // Sección de comentario
    const commentContainer = document.createElement('div');
    commentContainer.className = 'comment-container';
    
    const commentLabel = document.createElement('label');
    commentLabel.setAttribute('for', 'movie-comment');
    commentLabel.textContent = 'Comentario (opcional)';
    
    const commentTextarea = document.createElement('textarea');
    commentTextarea.id = 'movie-comment';
    commentTextarea.rows = 3;
    
    // Buscar si ya hay un comentario
    if (this.movie.ratings) {
      const userRating = this.findUserRating();
      if (userRating && userRating.comment) {
        commentTextarea.value = userRating.comment;
      }
    }
    
    const saveCommentButton = document.createElement('button');
    saveCommentButton.textContent = 'Guardar comentario';
    saveCommentButton.addEventListener('click', this.handlers.onSaveComment);
    
    commentContainer.appendChild(commentLabel);
    commentContainer.appendChild(commentTextarea);
    commentContainer.appendChild(saveCommentButton);
    
    this.element.appendChild(commentContainer);
    
    return this.element;
  }
  
  findUserRating() {
    if (!this.movie.ratings) return null;
    
    const userId = this.userState.userId;
    return this.movie.ratings.find(rating => {
      const ratingUserId = typeof rating.user === 'object' && rating.user._id 
        ? rating.user._id 
        : rating.user;
      return ratingUserId === userId;
    });
  }
} 