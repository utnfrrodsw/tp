//LOGICA PARA CONSULTAS A LA BD

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { TOKEN } = require('../../config');  

const db = require('../../models');  
const { jsonResponse } = require('../../lib/jsonResponse');


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
    console.log(req.body);
    const { nombre, apellido, email, contrasena, fechaNacimiento, telefono, esPrestador } = req.body;
    try {
      if(!!!nombre){       
        return res.status(400).json(jsonResponse(400, 'El nombre es requerido'));
      }
      console.log(contrasena);
      const hashedPassword = await bcrypt.hash(contrasena, 10); // 10 rounds de sal

      const usuario = await db.Usuario.create({
        nombre,
        apellido,
        email,
        contrasena: hashedPassword,
        fechaNacimiento,
        telefono,
        esPrestador,
      });

      console.log(usuario);

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
      /*const token = jwt.sign({ userId: usuario.idUsuario, email: usuario.email }, TOKEN, {
        expiresIn: '1h', // Token válido por 1 hora
      });*/

      const token = "token"
      const refreshToken = "refreshToken"
      const user = {
        id: usuario.idUsuario,
        email : usuario.email,
        nombre : usuario.nombre,
      }

      res.status(200).json({ message: 'Inicio de sesión exitoso', user, token, refreshToken });
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },
};

module.exports = usuarioController;