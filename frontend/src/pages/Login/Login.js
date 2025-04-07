import api from '../../services/api.js';
import auth from '../../utils/auth.js';
import './Login.css';

export default class Login {
  constructor(router) {
    this.router = router;
    this.element = null;
  }
  
  render() {
    // Verificar si el usuario ya está autenticado
    if (auth.isAuthenticated()) {
      this.router.navigate('/profile');
      return document.createElement('div'); // Return empty div
    }
    
    this.element = document.createElement('div');
    this.element.className = 'login-page';
    
    const container = document.createElement('div');
    container.className = 'container';
    
    const formCard = document.createElement('div');
    formCard.className = 'auth-card';
    
    const formTitle = document.createElement('h2');
    formTitle.textContent = 'Iniciar Sesión';
    formCard.appendChild(formTitle);
    
    // Mensaje de error (oculto por defecto)
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message hidden';
    errorMessage.id = 'login-error';
    formCard.appendChild(errorMessage);
    
    // Formulario
    const form = document.createElement('form');
    form.id = 'login-form';
    
    // Email
    const emailGroup = document.createElement('div');
    emailGroup.className = 'form-group';
    
    const emailLabel = document.createElement('label');
    emailLabel.setAttribute('for', 'email');
    emailLabel.textContent = 'Email';
    
    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.id = 'email';
    emailInput.name = 'email';
    emailInput.required = true;
    
    emailGroup.appendChild(emailLabel);
    emailGroup.appendChild(emailInput);
    
    // Contraseña
    const passwordGroup = document.createElement('div');
    passwordGroup.className = 'form-group';
    
    const passwordLabel = document.createElement('label');
    passwordLabel.setAttribute('for', 'password');
    passwordLabel.textContent = 'Contraseña';
    
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'password';
    passwordInput.name = 'password';
    passwordInput.required = true;
    
    passwordGroup.appendChild(passwordLabel);
    passwordGroup.appendChild(passwordInput);
    
    // Botón de envío
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Iniciar Sesión';
    
    // Enlace a registro
    const registerLink = document.createElement('p');
    registerLink.className = 'auth-link';
    registerLink.innerHTML = '¿No tienes cuenta? <a href="/register">Regístrate aquí</a>';
    
    // Añadir evento al enlace
    registerLink.querySelector('a').addEventListener('click', (e) => {
      e.preventDefault();
      this.router.navigate('/register');
    });
    
    // Añadir todos los elementos al formulario
    form.appendChild(emailGroup);
    form.appendChild(passwordGroup);
    form.appendChild(submitButton);
    
    // Añadir formulario y enlace a la tarjeta
    formCard.appendChild(form);
    formCard.appendChild(registerLink);
    
    // Añadir tarjeta al contenedor
    container.appendChild(formCard);
    
    // Añadir contenedor a la página
    this.element.appendChild(container);
    
    // Agregar evento de envío del formulario
    form.addEventListener('submit', this.handleLogin.bind(this));
    
    return this.element;
  }
  
  async handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    
    // Desactivar botón para evitar múltiples envíos
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Iniciando sesión...';
    
    // Ocultar mensaje de error previo
    const errorMessage = document.getElementById('login-error');
    errorMessage.classList.add('hidden');
    
    try {
      // Enviar solicitud de inicio de sesión
      await api.auth.login({ email, password });
      
      // Redirigir a la página de perfil
      this.router.navigate('/profile');
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      
      // Mostrar mensaje de error
      errorMessage.textContent = error.message || 'Error al iniciar sesión';
      errorMessage.classList.remove('hidden');
      
      // Reactivar botón
      submitButton.disabled = false;
      submitButton.textContent = 'Iniciar Sesión';
    }
  }
} 