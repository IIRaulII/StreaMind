/**
 * Router simple para la aplicación
 * Maneja la navegación entre páginas sin recargar la página
 */
export default class Router {
  constructor() {
    this.routes = []; // Almacena las rutas y sus funciones de callback
    this.currentPath = window.location.pathname; // Ruta actual
    
    // Manejar navegación con el botón de atrás/adelante
    window.addEventListener('popstate', () => {
      this.handleRoute(window.location.pathname);
    });
  }

  // Registra una nueva ruta
  add(path, callback) {
    this.routes.push({
      path,
      callback
    });
    return this;
  }

  // Navega a una ruta específica
  navigate(path) {
    window.history.pushState({}, '', path);
    return this.handleRoute(path);
  }

  // Maneja la ruta actual
  handleRoute(path) {
    this.currentPath = path;
    
    // Busca la ruta que coincide
    let matchedRoute = null;
    let params = [];
    
    for (const route of this.routes) {
      // Si es una expresión regular
      if (route.path instanceof RegExp) {
        const match = path.match(route.path);
        if (match) {
          matchedRoute = route;
          params = match;
          break;
        }
      } 
      // Si es una cadena
      else if (route.path === path) {
        matchedRoute = route;
        break;
      }
      // Si es la ruta comodín '*'
      else if (route.path === '*' && !matchedRoute) {
        matchedRoute = route;
      }
    }
    
    const container = document.getElementById('app');
    if (container && matchedRoute) {
      // Limpiar el contenedor
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      
      // Renderizar la nueva vista
      matchedRoute.callback(container, params);
    }
    
    return this;
  }

  // Inicia el router con la ruta actual
  init() {
    return this.handleRoute(window.location.pathname);
  }
} 