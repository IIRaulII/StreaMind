# StreaMind Frontend

Frontend para la aplicación StreaMind, una plataforma de gestión y seguimiento de películas y series con integración de TMDB.

## Tecnologías Utilizadas

- **JavaScript Vanilla**: Aplicación SPA sin frameworks
- **Vite**: Herramienta de construcción y servidor de desarrollo
- **CSS Personalizado**: Variables CSS para temas y consistencia
- **Arquitectura Modular**: Componentes independientes y reutilizables
- **APIs REST**: Comunicación con el backend mediante Axios
- **Gestión de Rutas**: Router personalizado para navegación SPA

## Estructura del Proyecto

```
frontend/
├── src/                 # Código fuente principal
│   ├── assets/          # Recursos estáticos (imágenes, iconos)
│   ├── components/      # Componentes reutilizables
│   │   ├── Header/      # Navegación principal
│   │   ├── Footer/      # Pie de página
│   │   └── MovieCard/   # Tarjeta de película
│   ├── pages/           # Páginas de la aplicación
│   │   ├── Home/        # Página principal
│   │   ├── Login/       # Autenticación
│   │   ├── Register/    # Registro de usuarios
│   │   ├── Search/      # Búsqueda de películas
│   │   ├── Profile/     # Perfil de usuario
│   │   ├── MovieDetail/ # Detalle de película
│   │   └── CreateMovie/ # Crear película manual
│   ├── services/        # Servicios y APIs
│   ├── utils/           # Utilidades y helpers
│   ├── router.js        # Sistema de enrutamiento
│   ├── main.js          # Punto de entrada
│   └── style.css        # Estilos globales
├── public/              # Archivos estáticos públicos
└── index.html           # HTML principal
```

## Características

- **Single Page Application (SPA)**: Navegación fluida sin recargas
- **Diseño Responsivo**: Adaptable a dispositivos móviles y escritorio
- **Tema Oscuro**: Interfaz con tema oscuro para mejor experiencia visual
- **Gestión de Estado**: Sistema para mantener estado de usuario y películas
- **Rutas Dinámicas**: Sistema de enrutamiento personalizado con soporte para parámetros
- **Componentes Modularizados**: Código organizado en componentes independientes

## Requisitos

- Node.js 14.x o superior
- Acceso al backend StreaMind API

## Instalación

1. **Clonar el repositorio**

```bash
git clone <repositorio>
cd frontend
```

2. **Instalar dependencias**

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Esto iniciará un servidor de desarrollo en `http://localhost:5173` (o el primer puerto disponible).

## Construcción para Producción

```bash
npm run build
```

Esto generará una versión optimizada para producción en el directorio `dist/`.

## Previsualización de Producción

```bash
npm run preview
```

## Arquitectura

### Sistema de Componentes

Cada componente sigue una estructura similar:

```javascript
export default class Component {
  constructor(router, ...args) {
    this.router = router;
    // Inicialización
  }
  
  render() {
    // Crear y devolver elementos del DOM
    return element;
  }
}
```

### Sistema de Enrutamiento

El router personalizado maneja:

- Navegación entre páginas sin recargas
- Coincidencias de rutas mediante cadenas o expresiones regulares
- Captura de parámetros en las URLs
- Integración con la API History del navegador

### Comunicación con el Backend

Se utiliza Axios para todas las peticiones al backend:

- Autenticación y gestión de tokens JWT
- Operaciones CRUD de películas y usuario
- Subida de archivos e imágenes

## Convenciones de Código

- Clases para componentes
- Métodos `render()` para generar el DOM
- Estilos CSS por componente
- Eventos gestionados mediante delegación

## Integración con TMDB

El frontend permite:

- Búsqueda de películas en TMDB
- Importación de películas a la colección del usuario
- Visualización de detalles, pósters y calificaciones

## Personalización

### Variables CSS

El archivo `style.css` contiene variables CSS para personalizar:

- Colores del tema
- Espaciados
- Tamaños de fuente
- Bordes y sombras

## Contribución

1. Clonar el repositorio
2. Crear una rama (`git checkout -b feature/nueva-caracteristica`)
3. Hacer commit de los cambios (`git commit -am 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crear un Pull Request 