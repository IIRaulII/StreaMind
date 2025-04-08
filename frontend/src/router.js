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
    
    // Forzar scroll al inicio con un enfoque específico para iOS
    this.resetScroll();
    
    return this.handleRoute(path);
  }

  // Método específico para resetear el scroll que funciona en iOS
  resetScroll() {
    // Primera ejecución inmediata
    this.executeScrollReset();
    
    // Múltiples intentos con tiempos diferentes para asegurar que funcione en iOS
    setTimeout(() => this.executeScrollReset(), 0);
    setTimeout(() => this.executeScrollReset(), 50);
    setTimeout(() => this.executeScrollReset(), 100);
    setTimeout(() => this.executeScrollReset(), 500);
  }
  
  // Ejecutar todas las técnicas posibles de reset de scroll
  executeScrollReset() {
    // 1. Scroll usando window
    window.scrollTo(0, 0);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
    
    // 2. Scroll usando document.body (importante para iOS)
    if (document.body) document.body.scrollTop = 0;
    
    // 3. Scroll usando documentElement (la mayoría de navegadores)
    if (document.documentElement) document.documentElement.scrollTop = 0;
    
    // 4. Scroll usando getElementById (enfoque alternativo)
    const appElement = document.getElementById('app');
    if (appElement) appElement.scrollTop = 0;
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

      // Forzar scroll al inicio después de renderizar
      this.resetScroll();
    }
    
    return this;
  }

  // Inicia el router con la ruta actual
  init() {
    return this.handleRoute(window.location.pathname);
  }
} 