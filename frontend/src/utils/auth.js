import Cookies from 'js-cookie';

/**
 * Utilidades para manejar la autenticación y estado del usuario
 */
const auth = {
  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean} - true si está autenticado, false si no
   */
  isAuthenticated: () => {
    return !!Cookies.get('token');
  },

  /**
   * Obtiene los datos del usuario actual
   * @returns {Object|null} - Datos del usuario o null si no hay usuario
   */
  getUser: () => {
    try {
      const userJson = localStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      return null;
    }
  },
  
  /**
   * Cierra la sesión del usuario
   */
  logout: () => {
    Cookies.remove('token');
    localStorage.removeItem('user');
  },

  /**
   * Redirecciona al usuario si no está autenticado
   * @param {Object} router - Instancia del router
   * @param {string} redirectUrl - URL a la que redirigir (por defecto: /)
   * @returns {boolean} - true si está autenticado, false si fue redirigido
   */
  requireAuth: (router, redirectUrl = '/') => {
    if (!auth.isAuthenticated()) {
      router.navigate(redirectUrl);
      return false;
    }
    return true;
  },

  /**
   * Redirecciona al usuario si ya está autenticado
   * @param {Object} router - Instancia del router
   * @param {string} redirectUrl - URL a la que redirigir (por defecto: /profile)
   * @returns {boolean} - true si no está autenticado, false si fue redirigido
   */
  requireNoAuth: (router, redirectUrl = '/profile') => {
    if (auth.isAuthenticated()) {
      router.navigate(redirectUrl);
      return false;
    }
    return true;
  }
};

export default auth; 