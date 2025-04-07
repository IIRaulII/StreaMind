const app = require('./app');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const PORT = 5000;

// Iniciar servidor sin especificar host
const server = app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT} en modo ${process.env.NODE_ENV || 'desarrollo'}`);
  console.log(`Prueba acceder a: http://localhost:${PORT}`);
});

// Manejar errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('Error no manejado:', err.message);
  // Cerrar servidor y salir del proceso
  server.close(() => process.exit(1));
});
