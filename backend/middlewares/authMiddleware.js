const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware para proteger rutas que requieren autenticación
 * Verifica que el usuario tiene un token JWT válido
 */
exports.protect = async (req, res, next) => {
  let token;

  // Verificar si existe el token en los headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extraer token del header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    // Extraer token de las cookies
    token = req.cookies.token;
  }

  // Verificar que exista el token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No estás autorizado para acceder a este recurso'
    });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Añadir el usuario al request
    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'No estás autorizado para acceder a este recurso'
    });
  }
};
