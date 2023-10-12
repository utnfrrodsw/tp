//LOGICA PARA CONSULTAS A LA BD

const bcrypt = require('bcrypt');
const db = require('../../models');  
const { jsonResponse } = require('../../lib/jsonResponse');
const { getUserInfo } = require('../../lib/getUserInfo');
const Usuario = require('../../models/Usuario');
const { generateAccessTokes, generateRefreshToken } = require('../../auth/generateTokens.js');
const getTokenFromHeader = require('../../auth/getTokenFromHeader');
const { verifyRefreshToken } = require('../../auth/verifyTokens');
const validateToken = require('../../auth/validateToken');

const usuarioController = {

  getUsuarios: async (req, res) => {
    try {
      const usuarios = await db.Usuario.findAll();
      res.status(200).json(jsonResponse(200, {
        usuarios,
        message: 'Usuarios obtenidos exitosamente' 
      }));
    } catch (error) {
      console.error('Error al obtener usuarios', error);
      res.status(500).json(jsonResponse(500, {
        message: 'Error al obtener usuarios' 
      }));
    }
  },

  getUsuario: async (req, res) => {
    const { id } = req.params;
    try {
      const usuario = await db.Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json(jsonResponse(200, {
        usuario,
        message: 'Usuario obtenido exitosamente'
      }));
    } catch (error) {
      console.error('Error al obtener usuario por ID', error);
      res.status(500).json(jsonResponse(500, {
        message: 'Error al obtener usuario por ID' 
      }));    
    }
  },
 
  registrarUsuario: async (req, res) => {
    //console.log(req.body);
    const { nombre, apellido, email, contrasena, fechaNacimiento, telefono, esPrestador } = req.body;
    console.log(req.body)
    try {
      const result = await db.Usuario.findOne({
        where: { email },
      })
      .then(result => {
        return result;
      });
      console.log(result);
      // Verificar si el usuario ya existe en la base de datos
      if (result != null) {
        console.log("usuario ya existe");
        return res.status(500).json(jsonResponse(500, {
          message: 'El usuario ya existe' 
        }));
      }

      console.log(nombre, apellido, email, contrasena, fechaNacimiento, telefono, esPrestador)
     
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

      res.status(200).json(jsonResponse(200, { message: 'Registro exitoso', usuario }));

    } catch (error) {
      console.error(error);
      res.status(500).json(jsonResponse(500, {
        message: 'Error al registrarse' 
      }));
    }
  },

  login: async (req, res) => {
    const { email, constrasena } = req.body;
    try {
      // Buscar al usuario en la base de datos por su correo electrónico
      const usuario = await db.Usuario.findOne({
        where: { email },
      })
      .then(usuario => {
        return usuario;
      });

      if (usuario != null) {
        const comprare = await bcrypt.compare(constrasena, usuario.contrasena);
        if (comprare === true) {
          console.log("usuario logueado, generando token");
          const user = getUserInfo(usuario);
          const token = await generateAccessTokes(user);
          const refreshToken = await generateRefreshToken(user);
          try{
            console.log("guardando token")
            await new db.Token({ token: refreshToken }).save();
          }catch(error){
            console.log(error);
          }
          console.log("inicio sesion correctamente");
          res.status(200).json(jsonResponse(200, {message: 'Inicio de sesión exitoso', user: getUserInfo(user), token, refreshToken}));
        }else{
          res.status(401).json(jsonResponse(401, {
            message: 'Usuario o contraseña incorrectos' 
          }));  
        }
      }else{
        res.status(401).json(jsonResponse(401, {
          message: 'Usuario o contraseña incorrectos' 
        }));
      }
      
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      res.status(500).json(jsonResponse(500, {
        message: 'Error al loguearse' 
      }));
    }
  },

  refreshToken: async (req, res) => {
    const refreshToken = await getTokenFromHeader(req.headers);
    if(refreshToken){
      try{
        const found = await db.Token.findOne({ where: { token: refreshToken } });
        if(!found){
          res.status(401).json(jsonResponse(401, {
            error: 'No Autorizado 1' 
          }));
        }
        const payload = verifyRefreshToken(found.token);
        if(payload){
          const accessToken = await generateAccessTokes(payload.user);
          return res.status(200).json(jsonResponse(200, {accessToken})); 
        }else{
          return res.status(401).json(jsonResponse(401, {
            error: 'No Autorizado 2'
          })); 
        }
      }catch(error){
        return res.status(401).json(jsonResponse(401, {
          error: 'No Autorizado 3'
        })); 
      }
    }else{
      return res.status(401).json(jsonResponse(401, {
        error: 'No Autorizado 4'
      })); 
    }

  },

  logout: async (req, res) => {
    try {
      const refreshToken = validateToken(req.headers);
      await db.Token.destroy({where: {token: refreshToken }});
      res.status(200).json(jsonResponse(200, {
        success: "Token eliminado exitosamente",
      }));
      console.log("cerro sesion correctamente");
    } catch (ex) {
      console.log(ex);
    }
  },
};

module.exports = usuarioController;