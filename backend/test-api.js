// Script para probar las funcionalidades básicas de la API
const axios = require('axios');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const API_URL = `http://localhost:${process.env.PORT || 5000}`;

async function testAPI() {
  console.log('🧪 Iniciando pruebas de la API de StreaMind');
  console.log(`🌐 URL de la API: ${API_URL}`);
  console.log('--------------------------------------------');

  try {
    // 1. Probar la ruta principal
    console.log('\n📋 Comprobando que la API está en funcionamiento...');
    const homeResponse = await axios.get(API_URL);
    console.log('Respuesta:', homeResponse.data);
    console.log('Estado: ✅ OK');

    // 2. Registrar un usuario de prueba
    console.log('\n📋 Registrando usuario de prueba...');
    const userData = {
      name: 'Usuario Prueba',
      email: `test${Date.now()}@example.com`, // Email único para evitar duplicados
      password: 'password123'
    };
    
    try {
      const registerResponse = await axios.post(`${API_URL}/api/auth/register`, userData);
      console.log('Usuario registrado correctamente');
      console.log('Token JWT recibido:', registerResponse.data.token ? '✅ OK' : '❌ ERROR');
      
      // Guardar token para futuras peticiones
      const token = registerResponse.data.token;
      
      // 3. Probar búsqueda de películas
      console.log('\n📋 Buscando películas...');
      const searchResponse = await axios.get(`${API_URL}/api/movies/search?query=inception`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log(`Películas encontradas: ${searchResponse.data.count}`);
      if (searchResponse.data.count > 0) {
        console.log('Primera película:', searchResponse.data.data[0].title);
      }
      console.log('Estado: ✅ OK');
      
    } catch (registerError) {
      if (registerError.response && registerError.response.status === 400) {
        console.log('Error al registrar usuario: Email ya registrado');
        
        // 4. Intentar login con usuario existente
        console.log('\n📋 Iniciando sesión con usuario existente...');
        try {
          const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
            email: userData.email,
            password: userData.password
          });
          
          console.log('Login exitoso');
          console.log('Token JWT recibido:', loginResponse.data.token ? '✅ OK' : '❌ ERROR');
        } catch (loginError) {
          console.error('Error al iniciar sesión:', loginError.response?.data || loginError.message);
        }
      } else {
        console.error('Error al registrar usuario:', registerError.response?.data || registerError.message);
      }
    }
    
  } catch (error) {
    console.error('Error en pruebas:', error.response?.data || error.message);
  }

  console.log('\n--------------------------------------------');
  console.log('🏁 Pruebas finalizadas');
}

// Ejecutar pruebas
testAPI().catch(console.error); 