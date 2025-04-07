# StreaMind API

API backend para la aplicación StreaMind, una plataforma de gestión de películas y series con integración de TMDB.

## Tecnologías

- **Node.js/Express**: Framework para la API REST
- **MongoDB/Mongoose**: Base de datos y ORM
- **JWT**: Autenticación basada en tokens
- **Multer**: Manejo de subida de archivos
- **CORS**: Soporte para peticiones cross-origin
- **Bcrypt**: Encriptación de contraseñas
- **dotenv**: Gestión de variables de entorno

## Estructura del Proyecto

```
backend/
├── controllers/       # Lógica de negocio
│   ├── authController.js
│   ├── movieController.js
│   └── userController.js
├── middlewares/       # Middleware personalizado
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   └── uploadMiddleware.js
├── models/            # Modelos de datos (Mongoose)
│   ├── Movie.js
│   └── User.js
├── routes/            # Definición de rutas
│   ├── auth.routes.js
│   ├── movie.routes.js
│   └── user.routes.js
├── services/          # Servicios externos
│   └── tmdbService.js
├── uploads/           # Directorio para archivos subidos
├── public/            # Archivos estáticos
├── utils/             # Utilidades
├── app.js             # Configuración principal Express
├── server.js          # Punto de entrada
└── .env               # Variables de entorno
```

## Requisitos

- Node.js 14.x o superior
- MongoDB (local o Atlas)
- Cuenta en TMDB para API Key

## Instalación

1. **Clonar el repositorio**

```bash
git clone <repositorio>
cd backend
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Crear un archivo `.env` con las siguientes variables:

```
PORT=5000
MONGO_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>/streamind?retryWrites=true&w=majority
JWT_SECRET=<clave_secreta_jwt>
JWT_EXPIRE=30d
TMDB_API_KEY=<tu_api_key_tmdb>
TMDB_API_URL=https://api.themoviedb.org/3
```

## Iniciar el Servidor

**Desarrollo**

```bash
npm run dev
```

**Producción**

```bash
npm start
```

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

## Integración con TMDB

El servicio `tmdbService.js` gestiona la comunicación con la API de TMDB para:

- Búsqueda de películas por título
- Importación de detalles de películas
- Obtención de imágenes (pósters, fondos)

## Gestión de Archivos

Se utiliza Multer para la gestión de subida de archivos. Los archivos subidos se almacenan en el directorio `/uploads` y se pueden acceder públicamente a través de la URL `/uploads/<nombre_archivo>`.

## Seguridad

- Autenticación mediante JWT
- Contraseñas encriptadas con bcrypt
- Protección de rutas mediante middleware de autenticación
- Configuración CORS para control de acceso
- Manejo centralizado de errores

## Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| PORT | Puerto del servidor (por defecto: 5000) |
| MONGO_URI | URI de conexión a MongoDB |
| JWT_SECRET | Clave secreta para generar tokens JWT |
| JWT_EXPIRE | Tiempo de expiración de tokens JWT |
| TMDB_API_KEY | API Key de TMDB |
| TMDB_API_URL | URL base de la API de TMDB |

## Manejo de Errores

El middleware `errorHandler.js` centraliza el manejo de errores en la aplicación, garantizando respuestas consistentes con formatos de error estandarizados. 