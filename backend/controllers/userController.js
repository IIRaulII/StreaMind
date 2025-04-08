const User = require('../models/User');
const fs = require('fs');
const path = require('path');

/**
 * @desc    Actualizar perfil de usuario
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Actualizar campos
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    
    // Actualizar contraseña si se proporciona
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatarUrl: updatedUser.avatarUrl,
        createdAt: updatedUser.createdAt
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el perfil',
      error: error.message
    });
  }
};

/**
 * @desc    Subir avatar de usuario
 * @route   POST /api/users/avatar
 * @access  Private
 */
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ninguna imagen'
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      // Eliminar el archivo subido si el usuario no existe
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Si ya existe un avatar, eliminar el anterior
    if (user.avatarUrl && user.avatarUrl !== '/assets/default-avatar.png') {
      try {
        // Obtener la ruta absoluta al archivo
        const oldAvatarPath = path.join(__dirname, '..', user.avatarUrl);
        console.log('Intentando eliminar avatar antiguo:', oldAvatarPath);
        
        // Verificar si el archivo existe antes de eliminarlo
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
          console.log('Avatar antiguo eliminado correctamente');
        } else {
          console.log('El avatar antiguo no existe en la ruta:', oldAvatarPath);
        }
      } catch (err) {
        console.error('Error al eliminar avatar antiguo:', err);
        // Continuamos con la actualización aunque falle la eliminación
      }
    }

    // La ruta debe comenzar con / para que sea relativa a la raíz del servidor
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    user.avatarUrl = avatarUrl;
    await user.save();

    console.log('Avatar actualizado correctamente. Nueva URL:', avatarUrl);
    console.log('Ruta completa del archivo:', path.join(__dirname, '..', avatarUrl));

    // Configurar cabeceras para evitar problemas CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

    // Añadir URL completa del servidor en entorno de producción con ruta de API para evitar CORS
    const apiAvatarUrl = `/api/uploads/avatars/${req.file.filename}`;
    const fullAvatarUrl = process.env.NODE_ENV === 'production' 
      ? `${process.env.API_URL}${apiAvatarUrl}`
      : apiAvatarUrl;

    return res.status(200).json({
      success: true,
      avatarUrl: fullAvatarUrl,
      message: 'Avatar actualizado correctamente'
    });
  } catch (error) {
    console.error('Error al subir el avatar:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al subir el avatar',
      error: error.message
    });
  }
};

/**
 * @desc    Obtener info pública de un usuario por ID
 * @route   GET /api/users/:id
 * @access  Public
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener información del usuario',
      error: error.message
    });
  }
};
