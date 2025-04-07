/**
 * Sistema de notificaciones para la aplicación
 * Permite mostrar mensajes temporales al usuario
 */

/**
 * Muestra una notificación en la pantalla
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duración en milisegundos antes de desaparecer
 */
function showNotification(message, type = 'info', duration = 3000) {
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  // Contenido
  notification.textContent = message;
  
  // Añadir al DOM
  document.body.appendChild(notification);
  
  // Mostrar con animación
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Ocultar después del tiempo especificado
  setTimeout(() => {
    notification.classList.remove('show');
    notification.classList.add('hide');
    
    // Eliminar del DOM después de la animación
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, duration);
}

/**
 * Muestra una notificación de éxito
 * @param {string} message - Mensaje a mostrar
 * @param {number} duration - Duración en ms
 */
function showSuccess(message, duration = 3000) {
  showNotification(message, 'success', duration);
}

/**
 * Muestra una notificación de error
 * @param {string} message - Mensaje a mostrar
 * @param {number} duration - Duración en ms
 */
function showError(message, duration = 4000) {
  showNotification(message, 'error', duration);
}

/**
 * Muestra una notificación de advertencia
 * @param {string} message - Mensaje a mostrar
 * @param {number} duration - Duración en ms
 */
function showWarning(message, duration = 3500) {
  showNotification(message, 'warning', duration);
}

/**
 * Muestra una notificación informativa
 * @param {string} message - Mensaje a mostrar
 * @param {number} duration - Duración en ms
 */
function showInfo(message, duration = 3000) {
  showNotification(message, 'info', duration);
}

/**
 * Muestra errores de validación o API de forma amigable
 * @param {Object|string} error - El objeto de error o mensaje de error
 * @param {number} duration - Duración en ms
 */
function showApiError(error, duration = 4000) {
  let message = 'Ha ocurrido un error desconocido';

  if (typeof error === 'string') {
    message = error;
  } else if (error && error.message) {
    message = error.message;
    
    // Manejar errores de validación específicos
    if (error.error && error.error.includes('validation failed')) {
      if (error.error.includes('synopsis')) {
        message = 'Por favor, asegúrate de que la película tiene una sinopsis';
      } else if (error.error.includes('title')) {
        message = 'Por favor, introduce el título de la película';
      } else if (error.error.includes('year')) {
        message = 'Por favor, introduce el año de la película';
      } else if (error.error.includes('genre')) {
        message = 'Por favor, introduce al menos un género';
      }
    }
  }

  showError(message, duration);
}

export default {
  showNotification,
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showApiError
}; 