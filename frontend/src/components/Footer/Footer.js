import './Footer.css';

export default class Footer {
  constructor(router) {
    this.router = router;
    this.element = null;
  }

  render() {
    this.element = document.createElement('footer');
    this.element.className = 'footer';
    
    const container = document.createElement('div');
    container.className = 'container footer-container';
    
    // Logo y descripción
    const footerBrand = document.createElement('div');
    footerBrand.className = 'footer-brand';
    
    // Crear contenedor para el logo
    const logoContainer = document.createElement('div');
    logoContainer.className = 'footer-logo';
    
    // Añadir imagen del logo
    const logoImg = document.createElement('img');
    logoImg.src = '/Logo.png';
    logoImg.alt = 'StreaMind Logo';
    logoImg.className = 'footer-logo-image';
    
    // Crear el texto del logo
    const logo = document.createElement('h2');
    logo.textContent = 'StreaMind';
    
    // Añadir imagen y texto al contenedor del logo
    logoContainer.appendChild(logoImg);
    logoContainer.appendChild(logo);
    
    const tagline = document.createElement('p');
    tagline.textContent = 'Tu memoria digital de películas';
    
    footerBrand.appendChild(logoContainer);
    footerBrand.appendChild(tagline);
    
    // Enlaces útiles
    const footerLinks = document.createElement('div');
    footerLinks.className = 'footer-links';
    
    const linksTitle = document.createElement('h3');
    linksTitle.textContent = 'Enlaces';
    
    const linksList = document.createElement('ul');
    
    const links = [
      { text: 'Inicio', url: '/' },
      { text: 'Búsqueda', url: '/search' },
      { text: 'Mi Perfil', url: '/profile' },
      { text: 'Añadir Película', url: '/movie/create' }
    ];
    
    links.forEach(link => {
      const listItem = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.href = link.url;
      anchor.textContent = link.text;
      
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        this.router.navigate(link.url);
      });
      
      listItem.appendChild(anchor);
      linksList.appendChild(listItem);
    });
    
    footerLinks.appendChild(linksTitle);
    footerLinks.appendChild(linksList);
    
    // Información de contacto
    const footerContact = document.createElement('div');
    footerContact.className = 'footer-contact';
    
    const contactTitle = document.createElement('h3');
    contactTitle.textContent = 'Contacto';
    
    const contactInfo = document.createElement('p');
    contactInfo.innerHTML = '<a href="mailto:info@streamind.com">info@streamind.com</a>';
    
    const socialLinks = document.createElement('div');
    socialLinks.className = 'social-links';
    
    const socialIcons = [
      { icon: 'fab fa-twitter', url: '#twitter' },
      { icon: 'fab fa-facebook', url: '#facebook' },
      { icon: 'fab fa-instagram', url: '#instagram' }
    ];
    
    socialIcons.forEach(social => {
      const socialLink = document.createElement('a');
      socialLink.href = social.url;
      socialLink.innerHTML = `<i class="${social.icon}"></i>`;
      
      // Solo añade evento de clic si el enlace no es un hashtag o es un enlace real
      if (!social.url.startsWith('#')) {
        socialLink.addEventListener('click', (e) => {
          e.preventDefault();
          this.router.navigate(social.url);
        });
      }
      
      socialLinks.appendChild(socialLink);
    });
    
    footerContact.appendChild(contactTitle);
    footerContact.appendChild(contactInfo);
    footerContact.appendChild(socialLinks);
    
    // Créditos / Copyright
    const footerCopyright = document.createElement('div');
    footerCopyright.className = 'footer-copyright';
    
    const currentYear = new Date().getFullYear();
    const copyrightText = document.createElement('p');
    copyrightText.innerHTML = `&copy; ${currentYear} StreaMind. Todos los derechos reservados.`;
    
    footerCopyright.appendChild(copyrightText);
    
    // Añadir todas las secciones al container
    container.appendChild(footerBrand);
    container.appendChild(footerLinks);
    container.appendChild(footerContact);
    
    // Añadir container y copyright al footer
    this.element.appendChild(container);
    this.element.appendChild(footerCopyright);
    
    return this.element;
  }
} 