const http = require('http');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Puerto a verificar
const PORT = 5000;

// Función para verificar la conexión a localhost
function checkLocalConnection(port, callback) {
  console.log(`Intentando conectar a http://localhost:${port}...`);

  const options = {
    hostname: 'localhost',
    port: port,
    path: '/',
    method: 'GET',
    timeout: 2000 // 2 segundos de timeout
  };

  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('RESPUESTA:');
      try {
        const parsed = JSON.parse(data);
        console.log(parsed);
      } catch (e) {
        console.log(data);
      }
      callback(null, true);
    });
  });

  req.on('error', (error) => {
    console.error(`ERROR: ${error.message}`);
    callback(error, false);
  });

  req.on('timeout', () => {
    console.error('TIMEOUT: La solicitud ha expirado');
    req.destroy();
    callback(new Error('Timeout'), false);
  });

  req.end();
}

// Función para verificar si un puerto está en uso
function checkPortInUse(port, callback) {
  const server = http.createServer();
  
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`El puerto ${port} está en uso.`);
      callback(null, true);
    } else {
      callback(err, false);
    }
    server.close();
  });
  
  server.once('listening', () => {
    console.log(`El puerto ${port} está libre.`);
    server.close();
    callback(null, false);
  });
  
  server.listen(port, '127.0.0.1');
}

// Verificar las conexiones
console.log('=== Verificando configuración del servidor ===');

// 1. Verificar si el puerto está en uso
checkPortInUse(PORT, (err, inUse) => {
  if (err) {
    console.error('Error al verificar puerto:', err.message);
    return;
  }
  
  if (inUse) {
    // 2. Si está en uso, intentar conectar a localhost:PORT
    checkLocalConnection(PORT, (err, success) => {
      if (err) {
        console.error(`No se pudo conectar al servidor en el puerto ${PORT}.`);
        console.log('\nDiagnóstico:');
        console.log(`- El puerto ${PORT} está en uso pero no se puede conectar a él.`);
        console.log('- Esto puede indicar un problema de firewall o que otra aplicación está usando el puerto.');
        console.log('- Intenta cambiar el puerto a otro número (ej. 8000, 9000, 3001).');
      } else {
        console.log(`Conexión a localhost:${PORT} exitosa!`);
      }
    });
  } else {
    console.log(`El servidor no está en ejecución en el puerto ${PORT}.`);
    console.log('Ejecuta "node server.js" para iniciar el servidor.');
  }
}); 