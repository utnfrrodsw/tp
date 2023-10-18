//LOGICA PARA CONSULTAS A LA BD

const bcrypt = require('bcrypt');
const db = require('../../models');  
const { jsonResponse } = require('../../lib/jsonResponse');
const { getUserInfo } = require('../../lib/getUserInfo');
const { generateAccessTokes, generateRefreshToken } = require('../../auth/generateTokens.js');
const getTokenFromHeader = require('../../auth/getTokenFromHeader');
const { verifyRefreshToken } = require('../../auth/verifyTokens');
const validateToken = require('../../auth/validateToken');
//const multer = require('multer'); // Para manejar la carga de imágenes


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
        const found = await db.Token.findOne({ 
          where: { token: refreshToken } 
        });
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