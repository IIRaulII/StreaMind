import './MovieHeader.css';

export default class MovieHeader {
  constructor(movie, onBack) {
    this.movie = movie;
    this.onBack = onBack;
    this.element = null;
  }
  
  render() {
    this.element = document.createElement('div');
    this.element.className = 'movie-header';
    
    // Botón de volver
    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.textContent = '← Volver';
    backButton.addEventListener('click', this.onBack);
    this.element.appendChild(backButton);
    
    // Título de la película
    const title = document.createElement('h1');
    title.textContent = this.movie.title;
    this.element.appendChild(title);
    
    // Año y géneros
    const metaInfo = document.createElement('div');
    metaInfo.className = 'meta-info';
    
    if (this.movie.year) {
      const year = document.createElement('span');
      year.className = 'year';
      year.textContent = this.movie.year;
      metaInfo.appendChild(year);
    }
    
    if (this.movie.genre && this.movie.genre.length > 0) {
      const genres = document.createElement('span');
      genres.className = 'genres';
      genres.textContent = this.movie.genre.join(', ');
      metaInfo.appendChild(genres);
    }
    
    this.element.appendChild(metaInfo);
    
    return this.element;
  }
} 