const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// Cargar variables de entorno
dotenv.config();

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const movieRoutes = require('./routes/movie.routes');

// Importar middleware de manejo de errores
const errorHandler = require('./middlewares/errorHandler');

// Crear app Express
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Configurar CORS según el entorno
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://streamind.netlify.app', process.env.FRONTEND_URL, '*']
  : ['http://localhost:5173', 'http://localhost:3000', '*'];

app.use(cors({
  origin: function(origin, callback) {
    // permitir solicitudes sin origen (como aplicaciones móviles o curl)
    if(!origin) return callback(null, true);
    
    // comprobar si el origen está permitido
    if(allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Disposition'],
  credentials: true
}));

// Logging en desarrollo
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Ruta para verificar que la API está funcionando
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de StreaMind funcionando correctamente',
    env: process.env.NODE_ENV
  });
});

// Ruta específica para el favicon
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/assets/favicon.ico'));
});

// Servir archivos estáticos
// Primero configuramos los uploads para mayor prioridad
app.use('/uploads', (req, res, next) => {
  console.log('Acceso a archivo estático:', req.url);
  // Establecer cabeceras CORS específicas para archivos
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'credentialless');
  res.header('Cross-Origin-Opener-Policy', 'same-origin');
  next();
}, express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1d',  // Cache de 1 día
  fallthrough: true // Continuar al siguiente middleware si no se encuentra el archivo
}));

// Ruta específica para avatares (para evitar problemas de CORS)
app.get('/api/uploads/:type/:filename', (req, res) => {
  const { type, filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', type, filename);
  
  // Comprobar si el archivo existe
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ 
      success: false, 
      message: 'Archivo no encontrado' 
    });
  }
  
  // Establecer headers correctos para evitar problemas CORS
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'credentialless');
  res.header('Cross-Origin-Opener-Policy', 'same-origin');
  
  // Enviar el archivo
  res.sendFile(filePath);
});

app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use('/test', express.static(path.join(__dirname, 'public')));

// Montar rutas API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Middleware para manejar errores
app.use(errorHandler);

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conexión a MongoDB establecida');
  })
  .catch(err => {
    console.error('Error al conectar con MongoDB:', err.message);
  });

module.exports = app;
