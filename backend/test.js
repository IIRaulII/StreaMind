// Archivo de prueba para verificar funcionalidades sin MongoDB
const tmdbService = require('./services/tmdbService');
const generateToken = require('./utils/generateToken');
const bcrypt = require('bcrypt');

// Cargar variables de entorno
require('dotenv').config();

async function runTests() {
  console.log('🧪 Iniciando pruebas básicas de StreaMind API');
  console.log('--------------------------------------------');

  // Probar generación de token
  console.log('\n📝 Prueba de generación de JWT:');
  const userId = '60d21b4667d0d8992e610c85'; // ID ficticio
  const token = generateToken(userId);
  console.log('Token generado:', token ? '✅ OK' : '❌ ERROR');

  // Probar encriptación de contraseña
  console.log('\n📝 Prueba de encriptación de contraseña:');
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);
  const isMatch = await bcrypt.compare(password, hashedPassword);
  console.log('Contraseña hasheada:', hashedPassword);
  console.log('Coincidencia:', isMatch ? '✅ OK' : '❌ ERROR');

  // Probar servicio de TMDb
  console.log('\n📝 Prueba de búsqueda en TMDb:');
  try {
    const searchResults = await tmdbService.searchMovies('inception');
    console.log(`Resultados encontrados: ${searchResults.length}`);
    console.log('Primer resultado:', searchResults[0] ? '✅ OK' : '❌ ERROR');
    
    console.log('\n📝 Prueba de detalles de película:');
    if (searchResults.length > 0) {
      const movieId = searchResults[0].id;
      const movieDetails = await tmdbService.getMovieDetails(movieId);
      console.log('Detalles de película:', movieDetails ? '✅ OK' : '❌ ERROR');
      console.log('Título:', movieDetails.title);
      console.log('Año:', movieDetails.year);
      console.log('Géneros:', movieDetails.genre.join(', '));
    }
  } catch (error) {
    console.error('Error en pruebas de TMDb:', error.message);
  }

  console.log('\n--------------------------------------------');
  console.log('🏁 Pruebas finalizadas');
}

runTests().catch(err => {
  console.error('Error en pruebas:', err);
}); 