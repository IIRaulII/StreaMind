import api from '../../services/api.js';
import auth from '../../utils/auth.js';
import './Header.css';

export default class Header {
  constructor(router) {
    this.router = router;
    this.element = null;
    this.isMobileMenuOpen = false;
  }

  render() {
    this.element = document.createElement('header');
    this.element.className = 'header';
    
    // Contenedor del header
    const container = document.createElement('div');
    container.className = 'container header-container';
    
    // Logo
    const logo = document.createElement('div');
    logo.className = 'logo';
    const logoLink = document.createElement('a');
    
    // Añadir imagen del logo
    const logoImg = document.createElement('img');
    logoImg.src = '/Logo.png';
    logoImg.alt = 'StreaMind Logo';
    logoImg.className = 'logo-image';
    
    // Añadir texto del logo
    const logoText = document.createElement('span');
    logoText.textContent = 'StreaMind';
    logoText.className = 'logo-text';
    
    logoLink.href = '/';
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.router.navigate('/');
    });
    
    logoLink.appendChild(logoImg);
    logoLink.appendChild(logoText);
    logo.appendChild(logoLink);
    
    // Botón de menú hamburguesa para móviles
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    menuToggle.setAttribute('aria-label', 'Abrir menú');
    menuToggle.addEventListener('click', () => this.toggleMobileMenu());
    
    // Navegación
    const nav = document.createElement('nav');
    nav.className = 'navigation';
    
    // Contenedor para enlaces (necesario para el menú móvil)
    const navLinks = document.createElement('div');
    navLinks.className = 'nav-links';
    
    // Botón para cerrar el menú en versión móvil
    const closeMenu = document.createElement('button');
    closeMenu.className = 'close-menu';
    closeMenu.innerHTML = '<i class="fas fa-times"></i>';
    closeMenu.setAttribute('aria-label', 'Cerrar menú');
    closeMenu.addEventListener('click', () => this.toggleMobileMenu());
    navLinks.appendChild(closeMenu);
    
    const navList = this.renderUserLinks();
    navLinks.appendChild(navList);
    nav.appendChild(navLinks);
    
    // Añadir elementos al contenedor
    container.appendChild(logo);
    container.appendChild(menuToggle);
    container.appendChild(nav);
    
    this.element.appendChild(container);
    
    return this.element;
  }
  
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    const navLinks = this.element.querySelector('.nav-links');
    
    if (this.isMobileMenuOpen) {
      navLinks.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevenir scroll cuando el menú está abierto
    } else {
      navLinks.classList.remove('active');
      document.body.style.overflow = ''; // Restaurar scroll
    }
  }
  
  update() {
    try {
      // Primero verificamos si el elemento existe
      if (!this.element) {
        console.warn('Header: No hay elemento para actualizar');
        return;
      }

      // Limpiar el listener del documento si existe para evitar duplicados
      if (this._documentClickListener) {
        document.removeEventListener('click', this._documentClickListener);
        this._documentClickListener = null;
      }

      // Crear nuevo elemento
      const newElement = this.render();
      
      // Solo intentar reemplazar si el elemento antiguo tiene un padre
      if (this.element.parentNode) {
        // Reemplazo seguro
        this.element.parentNode.replaceChild(newElement, this.element);
        this.element = newElement;
      } else {
        // Si no está en el DOM, simplemente actualizamos la referencia
        // pero no mostramos advertencia ya que esto puede ser normal en algunos casos
        this.element = newElement;
      }
    } catch (error) {
      console.error('Error al actualizar el Header:', error);
    }
  }

  renderUserLinks() {
    const navList = document.createElement('ul');
    navList.className = 'nav-list';
    
    // Enlaces que son siempre visibles
    // Inicio
    const homeItem = document.createElement('li');
    const homeLink = document.createElement('a');
    homeLink.textContent = 'Inicio';
    homeLink.href = '/';
    homeLink.className = this.router.currentPath === '/' ? 'active' : '';
    homeLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.router.navigate('/');
    });
    homeItem.appendChild(homeLink);
    navList.appendChild(homeItem);
    
    // Buscar
    const searchItem = document.createElement('li');
    const searchLink = document.createElement('a');
    searchLink.textContent = 'Buscar';
    searchLink.href = '/search';
    searchLink.className = this.router.currentPath === '/search' ? 'active' : '';
    searchLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.router.navigate('/search');
    });
    searchItem.appendChild(searchLink);
    navList.appendChild(searchItem);
    
    // Enlaces que cambian según si el usuario está autenticado
    if (auth.isAuthenticated()) {
      const user = auth.getUser();
      
      // Perfil de usuario con menú desplegable
      const userDropdown = document.createElement('li');
      userDropdown.className = 'user-dropdown';
      
      // Contenedor para el avatar y nombre de usuario
      const userInfo = document.createElement('div');
      userInfo.className = 'header-user-info';
      
      // Avatar del usuario
      const userAvatar = document.createElement('div');
      userAvatar.className = 'user-avatar';
      
      // Mostrar avatar si existe, o la inicial del usuario
      if (user.avatarUrl && user.avatarUrl !== '/assets/default-avatar.png') {
        const avatar = document.createElement('img');
        avatar.src = user.avatarUrl.startsWith('http') 
          ? user.avatarUrl 
          : `http://localhost:5000${user.avatarUrl}`;
        avatar.alt = 'Avatar';
        userAvatar.appendChild(avatar);
      } else {
        userAvatar.textContent = user.name.charAt(0).toUpperCase();
      }
      
      // Nombre del usuario
      const userName = document.createElement('span');
      userName.className = 'user-name';
      userName.textContent = user.name;
      
      userInfo.appendChild(userAvatar);
      userInfo.appendChild(userName);
      userDropdown.appendChild(userInfo);
      
      // Menú desplegable
      const dropdownMenu = document.createElement('div');
      dropdownMenu.className = 'dropdown-menu';
      
      // Enlace al perfil
      const profileLink = document.createElement('a');
      profileLink.href = '/profile';
      profileLink.textContent = 'Mi Perfil';
      profileLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.router.navigate('/profile');
        dropdownMenu.classList.remove('active');
      });
      dropdownMenu.appendChild(profileLink);
      
      // Separador
      const divider = document.createElement('div');
      divider.className = 'divider';
      dropdownMenu.appendChild(divider);
      
      // Enlace para añadir película
      const createMovieLink = document.createElement('a');
      createMovieLink.href = '/movie/create';
      createMovieLink.textContent = 'Añadir película';
      createMovieLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.router.navigate('/movie/create');
        dropdownMenu.classList.remove('active');
      });
      dropdownMenu.appendChild(createMovieLink);
      
      // Separador
      const divider2 = document.createElement('div');
      divider2.className = 'divider';
      dropdownMenu.appendChild(divider2);
      
      // Enlace para cerrar sesión
      const logoutLink = document.createElement('a');
      logoutLink.href = '#';
      logoutLink.textContent = 'Cerrar sesión';
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        // Primero cerrar sesión
        auth.logout();
        // Navegar al inicio (esto recargará toda la aplicación con el nuevo estado)
        this.router.navigate('/');
        // No llamar a this.update() aquí, el router se encargará de renderizar todo nuevamente
      });
      dropdownMenu.appendChild(logoutLink);
      
      userDropdown.appendChild(dropdownMenu);
      navList.appendChild(userDropdown);
      
      // Evento para mostrar/ocultar el menú desplegable
      userInfo.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('active');
      });
      
      // Aseguramos que solo hay un listener global para cerrar menús
      // Este enfoque evita añadir múltiples listeners al documento
      if (!this._documentClickListener) {
        this._documentClickListener = () => {
          // Cerrar todos los menús desplegables cuando se hace clic fuera
          document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('active');
          });
        };
        document.addEventListener('click', this._documentClickListener);
      }
    } else {
      // Iniciar sesión (para usuarios no autenticados)
      const loginItem = document.createElement('li');
      const loginLink = document.createElement('a');
      loginLink.textContent = 'Iniciar Sesión';
      loginLink.href = '/login';
      loginLink.className = this.router.currentPath === '/login' ? 'active' : '';
      loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.router.navigate('/login');
      });
      loginItem.appendChild(loginLink);
      navList.appendChild(loginItem);
      
      // Registrarse (para usuarios no autenticados)
      const registerItem = document.createElement('li');
      const registerLink = document.createElement('a');
      registerLink.textContent = 'Registrarse';
      registerLink.href = '/register';
      registerLink.className = this.router.currentPath === '/register' ? 'active' : '';
      registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.router.navigate('/register');
      });
      registerItem.appendChild(registerLink);
      navList.appendChild(registerItem);
    }
    
    return navList;
  }
} 