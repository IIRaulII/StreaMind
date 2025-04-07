import './ErrorSection.css';

export default class ErrorSection {
  constructor(router) {
    this.router = router;
    this.element = null;
    this.errorMessage = '';
  }
  
  render() {
    this.element = document.createElement('div');
    this.element.className = 'error-section hidden';
    this.element.id = 'error-section';
    
    // Mensaje de error
    const errorMessage = document.createElement('p');
    errorMessage.className = 'error-message';
    errorMessage.id = 'error-message';
    errorMessage.textContent = this.errorMessage || 'Ha ocurrido un error al cargar la película';
    
    // Botón para volver
    const backButton = document.createElement('button');
    backButton.textContent = 'Volver';
    backButton.addEventListener('click', () => {
      this.router.navigate('/');
    });
    
    this.element.appendChild(errorMessage);
    this.element.appendChild(backButton);
    
    return this.element;
  }
  
  setErrorMessage(message) {
    this.errorMessage = message;
    
    // Actualizar el mensaje en el DOM si ya está renderizado
    if (this.element) {
      const errorMessageElement = this.element.querySelector('#error-message');
      if (errorMessageElement) {
        errorMessageElement.textContent = message;
      }
    }
  }
  
  show() {
    if (this.element) {
      this.element.classList.remove('hidden');
      this.element.style.display = 'block';
    }
  }
  
  hide() {
    if (this.element) {
      this.element.classList.add('hidden');
      this.element.style.display = 'none';
    }
  }
} 