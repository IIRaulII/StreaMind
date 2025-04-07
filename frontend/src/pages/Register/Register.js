import api from '../../services/api.js';
import auth from '../../utils/auth.js';
import './Register.css';

export default class Register {
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
    this.element.className = 'register-page';
    
    const container = document.createElement('div');
    container.className = 'container';
    
    const formCard = document.createElement('div');
    formCard.className = 'auth-card';
    
    const formTitle = document.createElement('h2');
    formTitle.textContent = 'Crear Cuenta';
    formCard.appendChild(formTitle);
    
    // Mensaje de error (oculto por defecto)
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message hidden';
    errorMessage.id = 'register-error';
    formCard.appendChild(errorMessage);
    
    // Formulario
    const form = document.createElement('form');
    form.id = 'register-form';
    
    // Nombre
    const nameGroup = document.createElement('div');
    nameGroup.className = 'form-group';
    
    const nameLabel = document.createElement('label');
    nameLabel.setAttribute('for', 'name');
    nameLabel.textContent = 'Nombre';
    
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'name';
    nameInput.name = 'name';
    nameInput.required = true;
    
    nameGroup.appendChild(nameLabel);
    nameGroup.appendChild(nameInput);
    
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
    passwordInput.minLength = 6;
    
    passwordGroup.appendChild(passwordLabel);
    passwordGroup.appendChild(passwordInput);
    
    // Confirmar contraseña
    const confirmPasswordGroup = document.createElement('div');
    confirmPasswordGroup.className = 'form-group';
    
    const confirmPasswordLabel = document.createElement('label');
    confirmPasswordLabel.setAttribute('for', 'confirmPassword');
    confirmPasswordLabel.textContent = 'Confirmar Contraseña';
    
    const confirmPasswordInput = document.createElement('input');
    confirmPasswordInput.type = 'password';
    confirmPasswordInput.id = 'confirmPassword';
    confirmPasswordInput.name = 'confirmPassword';
    confirmPasswordInput.required = true;
    
    confirmPasswordGroup.appendChild(confirmPasswordLabel);
    confirmPasswordGroup.appendChild(confirmPasswordInput);
    
    // Botón de envío
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Registrarse';
    
    // Enlace a inicio de sesión
    const loginLink = document.createElement('p');
    loginLink.className = 'auth-link';
    loginLink.innerHTML = '¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>';
    
    // Añadir evento al enlace
    loginLink.querySelector('a').addEventListener('click', (e) => {
      e.preventDefault();
      this.router.navigate('/login');
    });
    
    // Añadir todos los elementos al formulario
    form.appendChild(nameGroup);
    form.appendChild(emailGroup);
    form.appendChild(passwordGroup);
    form.appendChild(confirmPasswordGroup);
    form.appendChild(submitButton);
    
    // Añadir formulario y enlace a la tarjeta
    formCard.appendChild(form);
    formCard.appendChild(loginLink);
    
    // Añadir tarjeta al contenedor
    container.appendChild(formCard);
    
    // Añadir contenedor a la página
    this.element.appendChild(container);
    
    // Agregar evento de envío del formulario
    form.addEventListener('submit', this.handleRegister.bind(this));
    
    return this.element;
  }
  
  async handleRegister(event) {
    event.preventDefault();
    
    const form = event.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    
    // Validar contraseñas coincidentes
    if (password !== confirmPassword) {
      const errorMessage = document.getElementById('register-error');
      errorMessage.textContent = 'Las contraseñas no coinciden';
      errorMessage.classList.remove('hidden');
      return;
    }
    
    // Desactivar botón para evitar múltiples envíos
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Registrando...';
    
    // Ocultar mensaje de error previo
    const errorMessage = document.getElementById('register-error');
    errorMessage.classList.add('hidden');
    
    try {
      // Enviar solicitud de registro
      await api.auth.register({ name, email, password });
      
      // Redirigir a la página de perfil
      this.router.navigate('/profile');
    } catch (error) {
      console.error('Error de registro:', error);
      
      // Mostrar mensaje de error
      errorMessage.textContent = error.message || 'Error al registrarse';
      errorMessage.classList.remove('hidden');
      
      // Reactivar botón
      submitButton.disabled = false;
      submitButton.textContent = 'Registrarse';
    }
  }
} 