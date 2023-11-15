const multer = require('multer');
const path = require('path');
const db = require('../../models');  
const fs = require('fs'); // Añade esta línea


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

const upload = multer({ storage: storage });

// Método para cargar la foto de perfil
const cargarFotoPerfil = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await db.Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Eliminar la foto de perfil anterior si existe
    if (usuario.fotoPerfil) {
      const fotoAnteriorPath = path.join(__dirname, '../../../public/images/fotoPerfil', usuario.fotoPerfil);
      if (fs.existsSync(fotoAnteriorPath)) {
        fs.unlinkSync(fotoAnteriorPath);
      }
    }

    // Leer el archivo de la imagen
    const foto = fs.readFileSync(req.file.path);

    // Actualizar los campos fotoPerfil y foto en la base de datos
    usuario.fotoPerfil = req.file.filename; // Almacenar el nombre del archivo en la base de datos
    usuario.foto = foto; // Almacenar la imagen en la base de datos
    await usuario.save();

    res.json({ success: true, message: 'Foto de perfil cargada con éxito' });
  } catch (error) {
    console.error('Error al actualizar la foto de perfil:', error);
    return res.status(500).json({ error: 'Error al actualizar la foto de perfil' });
  }
};

const obtenerFotoPerfil = async (req, res) => {
  const { id } = req.params;

  try {
    // Busca al usuario en la base de datos por su ID
    const usuario = await db.Usuario.findByPk(id);

    // Si el usuario no se encuentra, devuelve un error 404
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Construye la ruta al archivo de la foto de perfil
    const fotoPerfilPath = path.join(__dirname, '../../../public/images/fotoPerfil', usuario.fotoPerfil);

    // Verifica si el archivo de la foto de perfil existe
    if (!fs.existsSync(fotoPerfilPath)) {
      // Si el archivo no existe, verifica si la foto está en la base de datos
      if (usuario.foto) {
        // Si la foto está en la base de datos, la escribe en el sistema de archivos
        fs.writeFileSync(fotoPerfilPath, usuario.foto);
      } else {
        // Si la foto no está en la base de datos, devuelve un error 404
        return res.status(404).json({ error: 'Foto de perfil no encontrada' });
      }
    }

    // Envía el archivo de imagen como respuesta
    res.sendFile(fotoPerfilPath);
  } catch (error) {
    console.error('Error al obtener la foto de perfil:', error);
    return res.status(500).json({ error: 'Error al obtener la foto de perfil' });
  }
};

module.exports = {
  upload,
  cargarFotoPerfil,
  obtenerFotoPerfil
};