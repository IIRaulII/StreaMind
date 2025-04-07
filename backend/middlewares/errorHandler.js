/**
 * Middleware para manejar errores globales en la aplicación
 * @param {Error} err - El error capturado
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función next
 */
const errorHandler = (err, req, res, next) => {
  console.error(err);

  let error = { ...err };
  error.message = err.message;

  // Error de MongoDB por ID mal formado
  if (err.name === 'CastError') {
    const message = 'Recurso no encontrado';
    error = { message, statusCode: 404 };
  }

  // Error de duplicado en MongoDB
  if (err.code === 11000) {
    const message = 'Ya existe un recurso con ese valor';
    error = { message, statusCode: 400 };
  }

  // Error de validación de MongoDB
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Error del servidor'
  });
};

module.exports = errorHandler;
