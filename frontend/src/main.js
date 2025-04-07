import './style.css';
import Router from './router.js';
import Header from './components/Header/Header.js';
import Footer from './components/Footer/Footer.js';
import Home from './pages/Home/Home.js';
import Login from './pages/Login/Login.js';
import Register from './pages/Register/Register.js';
import Search from './pages/Search/Search.js';
import Profile from './pages/Profile/Profile.js';
import MovieDetail from './pages/MovieDetail/MovieDetail.js';
import CreateMovie from './pages/CreateMovie/CreateMovie.js';

// Crear el router
const router = new Router();

// Crear función para renderizar el layout
function renderLayout(container, component) {
  // Limpiar el contenedor
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  
  // Crear wrapper para toda la aplicación
  const appWrapper = document.createElement('div');
  appWrapper.className = 'app-wrapper';
  
  // Renderizar header
  const header = new Header(router);
  appWrapper.appendChild(header.render());
  
  // Crear contenedor principal
  const mainContent = document.createElement('main');
  mainContent.className = 'main-content';
  mainContent.appendChild(component);
  appWrapper.appendChild(mainContent);
  
  // Renderizar footer
  const footer = new Footer(router);
  appWrapper.appendChild(footer.render());
  
  // Añadir al contenedor
  container.appendChild(appWrapper);
}

// Definir rutas
router
  .add('/', (container) => {
    const homePage = new Home(router);
    homePage.render().then(component => {
      renderLayout(container, component);
    });
  })
  .add('/login', (container) => {
    const loginPage = new Login(router);
    renderLayout(container, loginPage.render());
  })
  .add('/register', (container) => {
    const registerPage = new Register(router);
    renderLayout(container, registerPage.render());
  })
  .add('/search', (container) => {
    const searchPage = new Search(router);
    renderLayout(container, searchPage.render());
  })
  .add('/profile', (container) => {
    const profilePage = new Profile(router);
    profilePage.render().then(component => {
      renderLayout(container, component);
    });
  })
  // Ruta para añadir película manualmente (debe ir ANTES de las rutas que usan expresiones regulares)
  .add('/movie/create', (container) => {
    const createMoviePage = new CreateMovie(router);
    renderLayout(container, createMoviePage.render());
  })
  // Ruta para películas de TMDb
  .add(/^\/movie\/tmdb\/([^\/]+)$/, (container, params) => {
    const id = params[1];
    const movieDetail = new MovieDetail(router, id, true);
    movieDetail.render().then(component => {
      renderLayout(container, component);
    });
  })
  // Ruta para películas de nuestra base de datos
  .add(/^\/movie\/([^\/]+)$/, (container, params) => {
    const id = params[1];
    const movieDetail = new MovieDetail(router, id);
    movieDetail.render().then(component => {
      renderLayout(container, component);
    });
  })
  // Ruta para páginas no encontradas
  .add('*', (container) => {
    const notFoundPage = document.createElement('div');
    notFoundPage.className = 'not-found-page';
    
    const notFoundContent = document.createElement('div');
    notFoundContent.className = 'container';
    
    const title = document.createElement('h1');
    title.textContent = 'Página no encontrada';
    
    const message = document.createElement('p');
    message.textContent = 'La página que estás buscando no existe.';
    
    const backButton = document.createElement('button');
    backButton.textContent = 'Volver al inicio';
    backButton.addEventListener('click', () => {
      router.navigate('/');
    });
    
    notFoundContent.appendChild(title);
    notFoundContent.appendChild(message);
    notFoundContent.appendChild(backButton);
    notFoundPage.appendChild(notFoundContent);
    
    renderLayout(container, notFoundPage);
  });

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Iniciar el router
  router.init();
}); 