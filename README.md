# StreaMind

StreaMind es una plataforma de gestión y seguimiento de películas y series con integración de TMDB (The Movie Database). Permite a los usuarios mantener un registro de las películas que han visto, quieren ver, y sus favoritas.

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

```
StreaMind/
├── frontend/         # Interfaz de usuario (JavaScript Vanilla + Vite)
└── backend/          # API REST (Node.js + Express + MongoDB)
```

## Tecnologías Utilizadas

### Frontend

- **JavaScript Vanilla**: Aplicación SPA sin frameworks
- **Vite**: Herramienta de construcción y servidor de desarrollo
- **CSS Personalizado**: Variables CSS para temas y consistencia
- **Arquitectura Modular**: Componentes independientes y reutilizables

### Backend

- **Node.js/Express**: Framework para la API REST
- **MongoDB/Mongoose**: Base de datos y ORM
- **JWT**: Autenticación basada en tokens
- **Multer**: Manejo de subida de archivos
- **CORS**: Soporte para peticiones cross-origin
- **Bcrypt**: Encriptación de contraseñas

## Características Principales

- **Gestión de películas**: Añadir, editar, eliminar películas
- **Categorización**: Marcar películas como vistas, por ver, favoritas
- **Valoraciones**: Sistema de calificación con estrellas y comentarios
- **Integración con TMDB**: Importación de películas desde una base de datos externa
- **Autenticación**: Sistema de registro e inicio de sesión
- **Interfaz Responsive**: Diseño adaptable a dispositivos móviles y escritorio
- **Tema Oscuro**: Interfaz visual con tema oscuro para mejor experiencia

## Requisitos

- Node.js 14.x o superior
- MongoDB (local o Atlas)
- Cuenta en TMDB para API Key

## Instalación y Configuración

### Backend

1. **Instalar dependencias**

```bash
cd backend
npm install
```

2. **Configurar variables de entorno**

Crear un archivo `.env` en el directorio `backend/` con:

```
PORT=5000
MONGO_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>/streamind?retryWrites=true&w=majority
JWT_SECRET=<clave_secreta_jwt>
JWT_EXPIRE=30d
TMDB_API_KEY=<tu_api_key_tmdb>
TMDB_API_URL=https://api.themoviedb.org/3
```

3. **Iniciar el servidor**

```bash
npm run dev
```

### Frontend

1. **Instalar dependencias**

```bash
cd frontend
npm install
```

2. **Iniciar el servidor de desarrollo**

```bash
npm run dev
```

Esto iniciará un servidor en `http://localhost:5173` (o el primer puerto disponible).

## Integración con TMDB

El proyecto utiliza la API de The Movie Database (TMDB) para:

- Búsqueda de películas por título
- Importación de detalles de películas (sinopsis, géneros, pósters, etc.)
- Visualización de pósters y fondos

## API Endpoints

### Autenticación

- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión

### Usuarios

- `GET /api/users/profile` - Obtener perfil del usuario actual
- `PUT /api/users/profile` - Actualizar perfil
- `DELETE /api/users` - Eliminar cuenta

### Películas

- `GET /api/movies` - Listar películas del usuario
- `GET /api/movies/:id` - Obtener detalles de una película
- `POST /api/movies` - Añadir película a la colección
- `POST /api/movies/import` - Importar película desde TMDB
- `PUT /api/movies/:id` - Actualizar información de película
- `DELETE /api/movies/:id` - Eliminar película
- `PUT /api/movies/:id/watched` - Marcar como vista
- `PUT /api/movies/:id/towatch` - Añadir a "Por ver"
- `PUT /api/movies/:id/favorite` - Añadir a favoritos
- `PUT /api/movies/:id/rating` - Calificar película
- `PUT /api/movies/:id/comment` - Añadir comentario

## Arquitectura

### Frontend

- **Sistema de Componentes**: Arquitectura modular con clases JavaScript
- **Router Personalizado**: Navegación SPA sin recargas de página
- **Estilos Modulares**: CSS por componente con variables globales

### Backend

- **Arquitectura MVC**: Modelos, controladores y rutas
- **API RESTful**: Endpoints con verbos HTTP adecuados
- **Middleware**: Autenticación, manejo de errores y subida de archivos

## Capturas de Pantalla

[Aquí se pueden incluir capturas de pantalla de la aplicación]

## Desarrollo Futuro

- Implementación de tema claro/oscuro seleccionable
- Soporte para series de TV
- Recomendaciones basadas en gustos del usuario
- Funcionalidades sociales (compartir listas, seguir a usuarios)

## Contribución

1. Clonar el repositorio
2. Crear una rama (`git checkout -b feature/nueva-caracteristica`)
3. Hacer commit de los cambios (`git commit -am 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crear un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo LICENSE para más detalles.

