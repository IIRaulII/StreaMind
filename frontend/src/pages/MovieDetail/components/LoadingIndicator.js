import './LoadingIndicator.css';

export default class LoadingIndicator {
  constructor() {
    this.element = null;
  }
  
  render() {
    this.element = document.createElement('div');
    this.element.className = 'loading';
    this.element.id = 'loading-indicator';
    
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    
    const loadingText = document.createElement('p');
    loadingText.textContent = 'Cargando detalles de la película...';
    
    this.element.appendChild(spinner);
    this.element.appendChild(loadingText);
    
    return this.element;
  }
  
  show() {
    if (this.element) {
      this.element.classList.remove('hidden');
      this.element.style.display = 'flex';
    }
  }
  
  hide() {
    if (this.element) {
      this.element.classList.add('hidden');
      this.element.style.display = 'none';
    }
  }
} 