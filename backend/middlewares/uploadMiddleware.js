const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Determinar la carpeta destino según el tipo de imagen
    let uploadType = 'posters'; // Por defecto, posters
    
    // Si es un avatar, siempre usar la carpeta avatars
    if (file.fieldname === 'avatar') {
      uploadType = 'avatars';
    } else if (req.params.type) {
      uploadType = req.params.type;
    }
    
    const uploadPath = path.join(__dirname, `../uploads/${uploadType}`);
    
    // Asegurarse de que el directorio existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
      console.log(`Directorio creado: ${uploadPath}`);
    }
    
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    // Generar nombre de archivo único para evitar colisiones
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExt);
  }
});

// Filtro para solo permitir imágenes
const fileFilter = (req, file, cb) => {
  // Tipos de archivos aceptados
  const filetypes = /jpeg|jpg|png|gif/;
  // Verificar la extensión
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Verificar el mimetype
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif)'), false);
  }
};

// Exportar middleware de multer con la configuración
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
  fileFilter: fileFilter
});

module.exports = {
  uploadAvatar: upload.single('avatar'),
  uploadPoster: upload.single('poster')
};
