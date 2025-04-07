// Script para probar la conexión con TMDb
const dotenv = require('dotenv');
const tmdbService = require('./services/tmdbService');

// Cargar variables de entorno
dotenv.config();

async function testTMDB() {
  console.log('🧪 Iniciando pruebas de conexión con TMDb');
  console.log('--------------------------------------------');
  console.log('API Key configurada:', process.env.TMDB_API_KEY ? '✅' : '❌');
  console.log('API URL configurada:', process.env.TMDB_API_URL);

  try {
    // Probar búsqueda de películas
    console.log('\n📋 Prueba de búsqueda:');
    const searchQuery = 'matrix';
    console.log(`Buscando "${searchQuery}"...`);
    
    const searchResults = await tmdbService.searchMovies(searchQuery);
    console.log(`Resultados encontrados: ${searchResults.length}`);
    
    if (searchResults.length > 0) {
      const firstMovie = searchResults[0];
      console.log('\nPrimer resultado:');
      console.log(`- Título: ${firstMovie.title}`);
      console.log(`- Año: ${firstMovie.release_date ? firstMovie.release_date.split('-')[0] : 'N/A'}`);
      console.log(`- ID: ${firstMovie.id}`);
      
      // Probar obtención de detalles
      console.log('\n📋 Prueba de detalles:');
      console.log(`Obteniendo detalles para ID: ${firstMovie.id}...`);
      
      const movieDetails = await tmdbService.getMovieDetails(firstMovie.id);
      console.log('\nDetalles obtenidos:');
      console.log(`- Título: ${movieDetails.title}`);
      console.log(`- Año: ${movieDetails.year}`);
      console.log(`- Géneros: ${movieDetails.genre.join(', ')}`);
      console.log(`- Póster: ${movieDetails.posterUrl ? '✅ Disponible' : '❌ No disponible'}`);
      console.log(`- Sinopsis: ${movieDetails.synopsis.substring(0, 100)}...`);
    }
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }

  console.log('\n--------------------------------------------');
  console.log('🏁 Pruebas finalizadas');
}

// Ejecutar pruebas
testTMDB().catch(console.error); 