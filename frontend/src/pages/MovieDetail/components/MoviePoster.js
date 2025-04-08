import './MoviePoster.css';

export default class MoviePoster {
  constructor(movie) {
    this.movie = movie;
    this.element = null;
  }
  
  render() {
    this.element = document.createElement('div');
    this.element.className = 'poster-container';
    
    const poster = document.createElement('img');
    if (this.movie.posterUrl) {
      poster.src = this.movie.posterUrl.startsWith('http') 
        ? this.movie.posterUrl 
        : `${import.meta.env.VITE_API_URL}${this.movie.posterUrl}`;
    } else {
      poster.src = '/placeholder.jpg';
    }
    poster.alt = `${this.movie.title} poster`;
    poster.loading = 'lazy';
    
    this.element.appendChild(poster);
    
    return this.element;
  }
} 