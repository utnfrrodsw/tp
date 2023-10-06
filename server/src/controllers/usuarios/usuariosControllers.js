//LOGICA PARA CONSULTAS A LA BD

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { TOKEN } = require('../../config');  

const db = require('../../models');  
const multer = require('multer'); // Para manejar la carga de imágenes


const usuarioController = {
  getUsuarios: async (req, res) => {
    try {
      const usuarios = await db.Usuario.findAll();
      res.json(usuarios);
    } catch (error) {
      console.error('Error al obtener usuarios', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },

  getUsuario: async (req, res) => {
    const { id } = req.params;
    try {
      const usuario = await db.Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(usuario);
    } catch (error) {
      console.error('Error al obtener usuario por ID', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },

   registrarUsuario: async (req, res) => {
    const { name, surname, email, password, birthDate, phoneNumber, isPrestador } = req.body;
    try {
      // Verificar si el usuario ya existe en la base de datos (según el email)
      const existingUser = await db.Usuario.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }
  
      // Hacer el hash de la contraseña antes de almacenarla en la base de datos
      const hashedPassword = await bcrypt.hash(password, 10); // 10 rounds de sal
  
      // Crear el nuevo usuario en la base de datos
      const usuario = await db.Usuario.create({
        name,
        surname,
        email,
        password: hashedPassword,
        birthDate,
        phoneNumber,
        isPrestador,
      });
  
      res.status(201).json({ message: 'Registro exitoso', usuario });
    } catch (error) {
      console.error('Error en el registro:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      // Buscar al usuario en la base de datos por su correo electrónico
      const usuario = await db.Usuario.findOne({ where: { email } });
      if (!usuario) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
      }

      // Comparar la contraseña proporcionada con la contraseña almacenada en la base de datos
      const passwordMatch = await bcrypt.compare(password, usuario.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }

      // Generar un token de autenticación
      const token = jwt.sign({ userId: usuario.idUsuario, email: usuario.email }, TOKEN, {
        expiresIn: '1h', // Token válido por 1 hora
      });

      res.status(200).json({ message: 'Inicio de sesión exitoso', token, userType: usuario.tipo });
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },
  
  obtenerDatosUsuario: async (req, res) => {
    const { id } = req.params;
  
      try {
        // Buscar el usuario por su ID y seleccionar solo los campos necesarios
        const usuario = await db.Usuario.findByPk(id, {
          attributes: ['nombre', 'apellido', 'email', 'fechaNacimiento'],
        });
  
        if (!usuario) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
        }
  
        res.json(usuario);
      } catch (error) {
        console.error('Error al obtener datos del usuario', error);
        res.status(500).json({ message: 'Error en el servidor' });
      }
    },


  modificarDatosPersonales: async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, email, fechaNacimiento } = req.body;

    try {
      const usuario = await db.Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Actualizar los datos personales del usuario
      usuario.nombre = nombre;
      usuario.apellido = apellido;
      usuario.email = email;
      usuario.fechaNacimiento = fechaNacimiento;

      await usuario.save();

      res.status(200).json({ message: 'Datos personales actualizados exitosamente' });
    } catch (error) {
      console.error('Error al modificar los datos personales del usuario', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },


  verificarClave: async (req, res) => {
    const { id } = req.params;
    const { claveActual } = req.body;
  
    try {
      const usuario = await db.Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      // Comparar la contraseña proporcionada con la contraseña almacenada en la base de datos
      const passwordMatch = await bcrypt.compare(claveActual, usuario.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Contraseña actual incorrecta' });
      }
  
      res.status(200).json({ message: 'Contraseña actual verificada correctamente' });
    } catch (error) {
      console.error('Error al verificar la contraseña actual del usuario', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },



  cambiarClave: async (req, res) => {
  const { id } = req.params;
  const { nuevaClave } = req.body;

  try {
    const usuario = await db.Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Hacer el hash de la nueva contraseña antes de actualizarla en la base de datos
    const hashedPassword = await bcrypt.hash(nuevaClave, 10); // 10 rounds de sal

    // Actualizar la contraseña del usuario
    usuario.password = hashedPassword;

    await usuario.save();

    res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar la contraseña del usuario', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
},



  getDireccion: async(req,res)=>{
      const { id } = req.params;
  
      try {
        // Buscar la dirección por su ID
        const direccion = await db.Direccion.findByPk(id);
  
        if (!direccion) {
          return res.status(404).json({ message: 'Dirección no encontrada' });
        }
  
        res.json(direccion);
      } catch (error) {
        console.error('Error al obtener dirección por ID', error);
        res.status(500).json({ message: 'Error en el servidor' });
      }
  },


  getLocalidad: async(req,res)=>{
    const { codPostal } = req.params;

    try {
      // Buscar la localidad por su código postal
      const localidad = await db.Localidad.findByPk(codPostal, {
        include: [
          {
            model: db.Direccion,
            as: 'fk_direccion_localidad',
          },
        ],
      });

      if (!localidad) {
        return res.status(404).json({ message: 'Localidad no encontrada' });
      }

      res.json(localidad);
    } catch (error) {
      console.error('Error al obtener localidad por código postal', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
    
  }

};

module.exports = usuarioController;