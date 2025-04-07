import './LoginPrompt.css';

export default class LoginPrompt {
  constructor(router) {
    this.router = router;
    this.element = null;
  }
  
  render() {
    this.element = document.createElement('div');
    this.element.className = 'login-section-container';
    
    const loginMessage = document.createElement('p');
    loginMessage.className = 'login-message';
    loginMessage.textContent = 'Inicia sesión para añadir esta película a tu colección, valorarla y más';
    
    const loginButton = document.createElement('button');
    loginButton.className = 'login-button';
    loginButton.textContent = 'Iniciar sesión';
    loginButton.addEventListener('click', () => {
      this.router.navigate('/login');
    });
    
    this.element.appendChild(loginMessage);
    this.element.appendChild(loginButton);
    
    return this.element;
  }
} 