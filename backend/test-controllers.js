// Script para probar los controladores directamente
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const authController = require('./controllers/authController');
const movieController = require('./controllers/movieController');

// Cargar variables de entorno
dotenv.config();

// Objetos simulados para req y res
const mockRequest = (body = {}, params = {}, query = {}, user = null) => {
  return {
    body,
    params,
    query,
    user
  };
};

async function testControllers() {
  console.log('🧪 Iniciando pruebas de controladores');
  console.log('--------------------------------------------');

  try {
    // Conectar a MongoDB
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conexión establecida ✅');

    // 1. Probar registro de usuario
    console.log('\n📋 Prueba: Registro de usuario');
    const testEmail = `test${Date.now()}@example.com`;
    const registerReq = mockRequest({
      name: 'Usuario Prueba',
      email: testEmail,
      password: 'password123'
    });
    
    const registerRes = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.data = data;
        return this;
      }
    };

    await authController.register(registerReq, registerRes);
    console.log(`Status: ${registerRes.statusCode}`);
    console.log(`Éxito: ${registerRes.data.success}`);
    console.log(`Token: ${registerRes.data.token ? '✅ Recibido' : '❌ No recibido'}`);
    
    if (registerRes.data.success) {
      const userId = registerRes.data.user._id;
      
      // 2. Probar búsqueda de películas
      console.log('\n📋 Prueba: Búsqueda de películas');
      
      const searchReq = mockRequest({}, {}, { query: 'inception' }, { _id: userId });
      const searchRes = {
        status: function(code) {
          this.statusCode = code;
          return this;
        },
        json: function(data) {
          this.data = data;
          return this;
        }
      };
      
      await movieController.searchMovies(searchReq, searchRes);
      console.log(`Status: ${searchRes.statusCode}`);
      console.log(`Éxito: ${searchRes.data.success}`);
      console.log(`Películas encontradas: ${searchRes.data.count}`);
      if (searchRes.data.count > 0) {
        console.log(`Primera película: ${searchRes.data.data[0].title}`);
      }
    }
    
    // Limpiar datos de prueba
    if (registerRes.data.success) {
      console.log('\n🧹 Limpiando datos de prueba...');
      await User.deleteOne({ email: testEmail });
      console.log('Usuario de prueba eliminado');
    }
    
  } catch (error) {
    console.error('Error en pruebas:', error);
  } finally {
    // Cerrar conexión a MongoDB
    await mongoose.connection.close();
    console.log('\nConexión a MongoDB cerrada');
    console.log('--------------------------------------------');
    console.log('🏁 Pruebas finalizadas');
  }
}

// Ejecutar pruebas
testControllers().catch(console.error); 