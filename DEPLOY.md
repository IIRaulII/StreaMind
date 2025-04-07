# Guía de Despliegue de StreaMind

## Despliegue del Frontend en Netlify

### 1. Preparación del repositorio

Asegúrate de que tu repositorio de GitHub esté actualizado con todos los cambios necesarios:

- La configuración de la API en `frontend/src/services/api.js` debe usar variables de entorno
- El archivo `netlify.toml` debe estar en la raíz del proyecto
- El archivo `.env.production` debe estar en la carpeta `frontend/`

### 2. Desplegar en Netlify

1. **Crear una cuenta en Netlify**

   Si aún no tienes una cuenta, regístrate en [netlify.com](https://netlify.com).

2. **Importar tu proyecto desde GitHub**

   - En el dashboard de Netlify, haz clic en "New site from Git"
   - Selecciona GitHub como proveedor de Git
   - Autoriza a Netlify para acceder a tus repositorios
   - Busca y selecciona tu repositorio de StreaMind

3. **Configurar el despliegue**

   - En la pantalla "Deploy settings", Netlify detectará automáticamente el archivo `netlify.toml`
   - Asegúrate de que los siguientes valores están configurados:
     - Build command: `npm run build`
     - Publish directory: `dist/`
     - Base directory: `frontend/`

4. **Configurar variables de entorno**

   - En la configuración del sitio, ve a "Site settings" > "Build & deploy" > "Environment"
   - Agrega la variable `VITE_API_URL` con la URL de tu backend

5. **Desplegar el sitio**

   - Haz clic en "Deploy site"
   - Netlify construirá y desplegará tu sitio automáticamente

### 3. Configurar el dominio personalizado (opcional)

   - En el dashboard de tu sitio en Netlify, ve a "Site settings" > "Domain management"
   - Sigue las instrucciones para configurar tu dominio personalizado

## Despliegue del Backend

### Opción 1: Despliegue en Render

1. **Crear una cuenta en Render**

   Regístrate en [render.com](https://render.com).

2. **Crear un nuevo servicio web**

   - Haz clic en "New" > "Web Service"
   - Conecta tu repositorio de GitHub
   - Configura el servicio:
     - Name: `streamind-api`
     - Root Directory: `backend`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `npm start`

3. **Configurar variables de entorno**

   En la sección "Environment", agrega las siguientes variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGO_URI`: Tu URI de MongoDB
   - `JWT_SECRET`: Una clave secreta fuerte
   - `JWT_EXPIRE`: `30d`
   - `TMDB_API_KEY`: Tu API Key de TMDB
   - `TMDB_API_URL`: `https://api.themoviedb.org/3`
   - `FRONTEND_URL`: URL de tu frontend en Netlify

4. **Desplegar el servicio**

   Haz clic en "Create Web Service". Render construirá y desplegará tu backend automáticamente.

### Opción 2: Despliegue en Heroku

Si prefieres usar Heroku:

1. **Crear una cuenta en Heroku**

   Regístrate en [heroku.com](https://heroku.com).

2. **Instalar Heroku CLI**

   Sigue las instrucciones en [devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli).

3. **Iniciar sesión y crear una aplicación**

   ```bash
   heroku login
   heroku create streamind-api
   ```

4. **Configurar variables de entorno**

   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set PORT=5000
   heroku config:set MONGO_URI=tu_uri_mongodb
   heroku config:set JWT_SECRET=tu_clave_secreta
   heroku config:set JWT_EXPIRE=30d
   heroku config:set TMDB_API_KEY=tu_api_key_tmdb
   heroku config:set TMDB_API_URL=https://api.themoviedb.org/3
   heroku config:set FRONTEND_URL=https://tu-sitio.netlify.app
   ```

5. **Configurar el Procfile**

   Crear un archivo `Procfile` en la carpeta `backend/` con el contenido:
   ```
   web: node server.js
   ```

6. **Desplegar la aplicación**

   ```bash
   git subtree push --prefix backend heroku main
   ```

## Actualizar la configuración de Netlify después del despliegue del backend

Una vez que hayas desplegado el backend, necesitas actualizar el archivo `netlify.toml` en la raíz de tu proyecto:

1. **Actualizar la redirección de la API**

   Edita la sección de redirecciones en el archivo `netlify.toml`:

   ```toml
   [[redirects]]
     from = "/api/*"
     to = "https://tu-backend-url.com/api/:splat"
     status = 200
     force = true
     headers = {Access-Control-Allow-Origin = "*"}
   ```

   Reemplaza `https://tu-backend-url.com` con la URL real de tu backend desplegado.

2. **Forzar una reconstrucción en Netlify**

   - Ve al dashboard de tu sitio en Netlify
   - Ve a "Deploys" > "Trigger deploy" > "Clear cache and deploy site"

## Verificación del despliegue

1. **Probar el frontend**

   Navega a tu sitio de Netlify (ej. `https://streamind.netlify.app`) y verifica que:
   - La página se carga correctamente
   - Puedes registrar e iniciar sesión
   - Puedes buscar y ver películas

2. **Probar el backend**

   Navega a la URL de tu backend (ej. `https://streamind-api.onrender.com`) y verifica que:
   - La ruta `/` devuelve un mensaje de que la API está funcionando
   - Las rutas protegidas requieren autenticación

## Solución de problemas comunes

### Errores CORS

Si encuentras errores de CORS, asegúrate de:
- Haber configurado correctamente los orígenes permitidos en el backend
- Que la URL del frontend esté correctamente agregada a las variables de entorno del backend

### Errores de conexión a la API

Si la aplicación no puede conectarse al backend:
- Verifica que la variable `VITE_API_URL` en Netlify es correcta
- Asegúrate de que el backend está ejecutándose
- Comprueba que las redirecciones en `netlify.toml` están configuradas correctamente

### Errores de MongoDB

Si el backend no puede conectarse a MongoDB:
- Verifica que el URI de MongoDB es correcto
- Asegúrate de que has configurado correctamente las IP permitidas en Atlas 