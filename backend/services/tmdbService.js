/**
 * Servicio para interactuar con la API de TMDb
 */

// Datos de prueba para simular respuestas de TMDb (solo como fallback)
const mockMovies = [
  {
    id: 123,
    title: "Inception",
    release_date: "2010-07-16",
    poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    overview: "Dom Cobb es un ladrón con una extraña habilidad para entrar a los sueños de la gente y robarles los secretos de sus subconscientes.",
    genres: [{ id: 28, name: "Acción" }, { id: 878, name: "Ciencia ficción" }]
  },
  {
    id: 456,
    title: "El Padrino",
    release_date: "1972-03-14",
    poster_path: "/wLXd1Iwmz9KbG7liWeLr3RSkRPO.jpg",
    overview: "Don Vito Corleone es el respetado y temido jefe de una de las cinco familias de la mafia de Nueva York.",
    genres: [{ id: 18, name: "Drama" }, { id: 80, name: "Crimen" }]
  }
];

// Función para buscar películas por título
exports.searchMovies = async (query) => {
  try {
    // Usar la API real de TMDb
    const url = `${process.env.TMDB_API_URL}/search/movie?api_key=${process.env.TMDB_API_KEY}&language=es-ES&query=${encodeURIComponent(query)}&page=1&include_adult=false`;
    
    console.log(`Buscando películas en TMDb con query: "${query}"`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.status_message || 'Error al buscar películas en TMDb');
    }
    
    return data.results;
  } catch (error) {
    console.error('Error en la búsqueda de TMDb:', error);
    
    // Fallback a datos mock en caso de error
    console.log('[FALLBACK] Usando datos mock para la búsqueda');
    return mockMovies.filter(movie => 
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
  }
};

// Función para obtener detalles de una película por su ID de TMDb
exports.getMovieDetails = async (movieId) => {
  try {
    // Usar la API real de TMDb
    const url = `${process.env.TMDB_API_URL}/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&language=es-ES`;
    
    console.log(`Obteniendo detalles de película de TMDb con ID: "${movieId}"`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.status_message || 'Error al obtener detalles de la película en TMDb');
    }
    
    return {
      tmdbId: data.id.toString(),
      title: data.title,
      year: new Date(data.release_date).getFullYear(),
      genre: data.genres.map(genre => genre.name),
      synopsis: data.overview || 'Sin sinopsis disponible.',
      posterUrl: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : '',
    };
  } catch (error) {
    console.error('Error al obtener detalles de TMDb:', error);
    
    // Fallback a datos mock en caso de error
    console.log('[FALLBACK] Usando datos mock para detalles de película');
    const mockMovie = mockMovies.find(movie => movie.id.toString() === movieId.toString());
    
    if (!mockMovie) {
      throw new Error('Película no encontrada');
    }
    
    return {
      tmdbId: mockMovie.id.toString(),
      title: mockMovie.title,
      year: new Date(mockMovie.release_date).getFullYear(),
      genre: mockMovie.genres.map(genre => genre.name),
      synopsis: mockMovie.overview || 'Sin sinopsis disponible.',
      posterUrl: mockMovie.poster_path ? `https://image.tmdb.org/t/p/w500${mockMovie.poster_path}` : '',
    };
  }
};
