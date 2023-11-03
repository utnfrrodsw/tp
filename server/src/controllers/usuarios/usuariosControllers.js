//LOGICA PARA CONSULTAS A LA BD
const bcrypt = require('bcrypt');
const db = require('../../models');  
const { jsonResponse } = require('../../lib/jsonResponse');
const { getUserInfo } = require('../../lib/getUserInfo');
const { generateAccessTokes, generateRefreshToken } = require('../../auth/generateTokens.js');
const getTokenFromHeader = require('../../auth/getTokenFromHeader');
const { verifyRefreshToken } = require('../../auth/verifyTokens');
const validateToken = require('../../auth/validateToken');
const { sendPasswordResetEmail } = require('./email'); // Importar la función sendPasswordResetEmail desde email.js
const { generateRandomResetCode } = require('./codeReset');
const { storeResetCodeInDatabase } = require('./codeResetDb');

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
 
  register: async (req, res) => {
    const {
      nombre,
      apellido,
      email,
      contrasena,
      fechaNacimiento,
      telefono,
      esPrestador,
      especialidades,
    } = req.body;
  
    try {
      // Verificar si el usuario ya existe en la base de datos
      const existingUser = await db.Usuario.findOne({
        where: { email },
      });
  
      if (existingUser) {
        return res.status(400).json(jsonResponse(400, { message: 'El usuario ya existe' }));
      }
  
      // Hashear la contraseña antes de guardarla
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(contrasena, saltRounds);
  
      // Crear el nuevo usuario en la base de datos
      const newUser = await db.Usuario.create({
        nombre,
        apellido,
        email,
        contrasena: hashedPassword,
        fechaNacimiento,
        telefono,
        esPrestador,
        // Otras propiedades específicas del usuario si las tienes
      });
  
      if (esPrestador && especialidades && especialidades.length > 0) {
        const profesionesIds = [];
      
        // Obtener las especialidades existentes y crear las nuevas
        await Promise.all(
          especialidades.map(async (especialidad) => {
            const existingEspecialidad = await db.Profesion.findOne({
              where: { nombreProfesion: especialidad },
            });
      
            if (existingEspecialidad) {
              // Si la especialidad ya existe, agrega su ID a la lista
              profesionesIds.push(existingEspecialidad.idProfesion);
            } else {
              // Si es una nueva especialidad, créala y agrega su ID
              const newProfesion = await db.Profesion.create({
                nombreProfesion: especialidad,
              });
              profesionesIds.push(newProfesion.idProfesion);
            }
          })
        );
      
        // Relacionar al usuario prestador con las especialidades
        await Promise.all(
          profesionesIds.map(async (profesionId) => {
              await db.PrestadorProfesiones.create({
                  idprestador: newUser.idUsuario, // ID del usuario recién creado
                  idProfesion: profesionId,
              });
          })
        );
      // Responder con un mensaje de registro exitoso
      res.status(201).json({
        message: 'Registro exitoso',
      });
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      res.status(500).json(jsonResponse(500, { message: 'Error al registrarse' }));
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
          res.status(200).json(jsonResponse(200, {message: 'Inicio de sesión exitoso', user, token, refreshToken}));
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
    
  },

  passwordReset: async (req, res) => {
    const { email } = req.body;

    try {
      // Verificar si el usuario existe en la base de datos
      const existingUser = await db.Usuario.findOne({
        where: { email },
      });

      if (!existingUser) {
        return res.status(404).json(jsonResponse(404, { message: 'Usuario no encontrado' }));
      }

      // Generar un código de recuperación (puedes utilizar una biblioteca para generar códigos aleatorios)
      const resetCode = generateRandomResetCode(); // Implementa esta función según tus necesidades

      // Almacenar el código de recuperación en la base de datos junto con la fecha de expiración
      await storeResetCodeInDatabase(email, resetCode); // Implementa esta función para guardar el código en la base de datos

      // Enviar el código de recuperación por correo electrónico
      await sendPasswordResetEmail(email, resetCode);

      res.status(200).json(jsonResponse(200, { message: 'Se ha enviado un correo electrónico con las instrucciones para restablecer la contraseña.' }));
    } catch (error) {
      console.error('Error al solicitar restablecimiento de contraseña:', error);
      res.status(500).json(jsonResponse(500, { message: 'Error al solicitar restablecimiento de contraseña' }));
    }
  },

  resetPassword: async (req, res) => {
    const { code, newPassword, email } = req.body;
  
    try {
      // Obtengo el usuario para el email ingresado
      const user = await db.Usuario.findOne({
        where: { email },
      });
  
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      const idUsuario = user.idUsuario;
  
      // Buscar un registro en la tabla ResetCode con el código y el idUsuario proporcionados
      const resetCodeRecord = await db.ResetCode.findOne({
        where: { code, userId: idUsuario },
      });
  
      if (!resetCodeRecord) {
        return res.status(404).json({ message: 'Código de recuperación no válido' });
      }
  
      // Verificar si el código ha expirado
      const currentDate = new Date();
      if (resetCodeRecord.expiresAt < currentDate) {
        // El código ha expirado
        return res.status(400).json({ message: 'El código de recuperación ha expirado' });
      }
  
      // Verificar si el código proporcionado coincide con el de la base de datos
      if (resetCodeRecord.code === code) {
        // Hashear la nueva contraseña antes de guardarla
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  
        // Actualizar la contraseña del usuario con la nueva contraseña hasheada
        user.contrasena = hashedPassword;
        await user.save();
  
        // Elimina el registro de ResetCode
        await resetCodeRecord.destroy();
  
        // Enviar una respuesta exitosa
        return res.status(200).json({ message: 'Contraseña restablecida con éxito' });
      }
  
      return res.status(400).json({ message: 'Código de recuperación incorrecto' });
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      return res.status(500).json({ message: 'Error al restablecer la contraseña' });
    }
  },

};

module.exports = usuarioController;