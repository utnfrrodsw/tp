//LOGICA PARA CONSULTAS A LA BD

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { TOKEN } = require('../../config');  

const db = require('../../models');  


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
};

module.exports = usuarioController;