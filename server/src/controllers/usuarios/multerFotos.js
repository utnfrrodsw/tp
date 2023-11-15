// Archivo: tu-archivo-de-rutas.js

const multer = require('multer');
const path = require('path');
const { cargarFotoPerfil } = require('./manejoFotos'); // Asegúrate de importar tus controladores adecuadamente

// Función para verificar si el archivo es una imagen
const isImage = (file) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];
  return allowedMimes.includes(file.mimetype);
};

// Configuración de multer para la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../public/images/fotoPerfil'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (isImage(file)) {
      cb(null, true);
    } else {
      cb(new Error('Formato de archivo no permitido. Solo se permiten imágenes PNG, JPEG y JPG.'));
    }
  },
});

// Ruta para cargar la foto de perfil
router.put('/cargarFotoPerfil/:id', upload.single('file'), cargarFotoPerfil);
