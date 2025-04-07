import './MovieInfo.css';

export default class MovieInfo {
  constructor(movie) {
    this.movie = movie;
    this.element = null;
  }
  
  render() {
    this.element = document.createElement('div');
    this.element.className = 'movie-info';
    
    // Sinopsis
    const synopsisTitle = document.createElement('h3');
    synopsisTitle.textContent = 'Sinopsis';
    this.element.appendChild(synopsisTitle);
    
    const synopsis = document.createElement('p');
    synopsis.className = 'synopsis';
    synopsis.textContent = this.movie.synopsis || 'No hay sinopsis disponible';
    this.element.appendChild(synopsis);
    
    // Información adicional si está disponible
    if (this.movie.director || this.movie.cast) {
      const additionalInfo = document.createElement('div');
      additionalInfo.className = 'additional-info';
      
      if (this.movie.director) {
        const director = document.createElement('p');
        director.innerHTML = `<strong>Director:</strong> ${this.movie.director}`;
        additionalInfo.appendChild(director);
      }
      
      if (this.movie.cast && this.movie.cast.length > 0) {
        const cast = document.createElement('p');
        cast.innerHTML = `<strong>Reparto:</strong> ${Array.isArray(this.movie.cast) ? this.movie.cast.join(', ') : this.movie.cast}`;
        additionalInfo.appendChild(cast);
      }
      
      this.element.appendChild(additionalInfo);
    }
    
    return this.element;
  }
} 