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
      direcciones,
    } = req.body;
  
    const t = await db.sequelize.transaction(); // Start a transaction
  
    try {
      // Verificar si el usuario ya existe en la base de datos
      const existingUser = await db.Usuario.findOne({
        where: { email },
        transaction: t,
      });
  
      if (existingUser) {
        await t.rollback(); // Rollback the transaction
        console.log("el usuario ya existe");
        return res.status(400).json(jsonResponse(400, { message: 'El usuario ya existe' }));
        
      }
  
      // Hashear la contraseña antes de guardarla
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(contrasena, saltRounds);
  
      // Crear el nuevo usuario en la base de datos
      const newUser = await db.Usuario.create(
        {
          nombre,
          apellido,
          email,
          contrasena: hashedPassword,
          fechaNacimiento,
          telefono,
          esPrestador,
          // Otras propiedades específicas del usuario si las tienes
        },
        { transaction: t }
      );
  
      // Asociar las direcciones con el nuevo usuario
      if (direcciones && direcciones.length > 0) {
        for (const direccion of direcciones) {
          let existingLocalidad;
  
          try {
            // Verificar si la Localidad ya existe
            existingLocalidad = await db.Localidad.findOne({
              where: { codPostal: direccion.codPostal },
              transaction: t,
            });
  
            console.log('Localidad existente:', existingLocalidad);
          } catch (error) {
            console.error('Error al buscar la localidad:', error);
            await t.rollback(); // Rollback the transaction
            throw error; // Lanza el error para detener la ejecución
          }
  
          // Si no existe, créala
          if (!existingLocalidad) {
            try {
              existingLocalidad = await db.Localidad.create({
                codPostal: direccion.codPostal,
                nombre: direccion.ciudad,
                provincia: direccion.provincia,
              }, { transaction: t });
  
              console.log('Localidad creada:', existingLocalidad);
            } catch (error) {
              console.error('Error al crear la localidad:', error);
              await t.rollback(); // Rollback the transaction
              throw error; // Lanza el error para detener la ejecución
            }
          }
  
          try {
            // Ahora puedes crear la dirección
            await db.Direccion.create({
              ...direccion,
              idUsuario: newUser.idUsuario,
            }, { transaction: t });
  
            console.log('Dirección creada correctamente');
          } catch (error) {
            console.error('Error al crear la dirección:', error);
            await t.rollback(); // Rollback the transaction
            throw error; // Lanza el error para detener la ejecución
          }
        }
      }
  
      // Relacionar al usuario prestador con las especialidades
      if (esPrestador && especialidades && especialidades.length > 0) {
        const profesionesIds = [];
  
        // Obtener las especialidades existentes y crear las nuevas
        await Promise.all(
          especialidades.map(async (especialidad) => {
            const existingEspecialidad = await db.Profesion.findOne({
              where: { nombreProfesion: especialidad },
              transaction: t,
            });
  
            if (existingEspecialidad) {
              // Si la especialidad ya existe, agrega su ID a la lista
              profesionesIds.push(existingEspecialidad.idProfesion);
            } else {
              // Si es una nueva especialidad, créala y agrega su ID
              const newProfesion = await db.Profesion.create({
                nombreProfesion: especialidad,
              }, { transaction: t });
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
            }, { transaction: t });
          })
        );
      }
  
      // Commit the transaction if everything is successful
      await t.commit();
  
      // Responder con un mensaje de registro exitoso
      res.status(201).json({
        message: 'Registro exitoso',
      });
    } catch (error) {
      console.error('Error en el registro:', error);
  
      // Rollback the transaction in case of an error
      await t.rollback();
  
      res.status(500).json(jsonResponse(500, { message: 'Error al registrarse' }));
    }
  },
  

  login: async (req, res) => {
    const { email, constrasena } = req.body;
  
    const t = await db.sequelize.transaction();
  
    try {
      // Buscar al usuario en la base de datos por su correo electrónico
      const usuario = await db.Usuario.findOne({
        where: { email },
        transaction: t,
      });
  
      if (usuario) {
        const compare = await bcrypt.compare(constrasena, usuario.contrasena);
  
        if (compare) {
          console.log("Usuario logueado, generando token");
          const user = getUserInfo(usuario);
          const token = await generateAccessTokes(user);
          const refreshToken = await generateRefreshToken(user);
  
          try {
            console.log("Guardando token");
            await db.Token.create({ token: refreshToken }, { transaction: t });
          } catch (error) {
            console.log(error);
            await t.rollback(); // Deshacer la transacción en caso de error
            res.status(500).json(jsonResponse(500, { message: 'Error al loguearse' }));
          }
  
          console.log("Inicio de sesión correctamente");
          await t.commit(); // Confirmar la transacción
          res.status(200).json(jsonResponse(200, { message: 'Inicio de sesión exitoso', user, token, refreshToken }));
        } else {
          res.status(401).json(jsonResponse(401, { message: 'Usuario o contraseña incorrectos' }));
        }
      } else {
        res.status(401).json(jsonResponse(401, { message: 'Usuario o contraseña incorrectos' }));
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      await t.rollback(); // Deshacer la transacción en caso de error
      res.status(500).json(jsonResponse(500, { message: 'Error al loguearse' }));
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
    const refreshToken = validateToken(req.headers);
  
    const t = await db.sequelize.transaction();
  
    try {
      await db.Token.destroy({
        where: { token: refreshToken },
        transaction: t,
      });
  
      await t.commit(); // Confirmar la transacción
  
      console.log("Cerró sesión correctamente");
      res.status(200).json(jsonResponse(200, { success: "Token eliminado exitosamente" }));
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      await t.rollback(); // Deshacer la transacción en caso de error
      res.status(500).json(jsonResponse(500, { message: 'Error al cerrar sesión' }));
    }
  },

obtenerDatosUsuario: async (req, res) => {
    const { id } = req.params;
  
    const t = await db.sequelize.transaction(); // Inicia una transacción
  
    try {
      // Buscar el usuario por su ID y seleccionar solo los campos necesarios
      const usuario = await db.Usuario.findByPk(id, {
        attributes: ['nombre', 'apellido', 'email', 'fechaNacimiento'],
        transaction: t, // Asocia la transacción a la consulta
      });
  
      if (!usuario) {
        await t.rollback(); // Revierte la transacción si el usuario no se encuentra
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      await t.commit(); // Confirma la transacción si todo está bien
      res.json(usuario);
    } catch (error) {
      console.error('Error al obtener datos del usuario', error);
      await t.rollback(); // Revierte la transacción en caso de error
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },
  
obtenerProfesionesUsuario: async (req, res) => {
    const t = await db.sequelize.transaction(); // Inicia una transacción
  
    try {
      const idUsuario = req.params.id;
      const prestadorProfesiones = await db.PrestadorProfesiones.findAll({
        where: { idprestador: idUsuario },
        include: [
          {
            model: db.Profesion,
            as: 'profesion',
            transaction: t, // Asocia la transacción a la consulta
          },
        ],
        transaction: t, // Asocia la transacción a la consulta principal
      });
  
      const profesiones = prestadorProfesiones.map(prestadorProfesion => prestadorProfesion.profesion.nombreProfesion);
  
      await t.commit(); // Confirma la transacción si todo está bien
      res.json(profesiones);
    } catch (error) {
      console.error(error);
      await t.rollback(); // Revierte la transacción en caso de error
      res.status(500).json({ message: 'Error al obtener las profesiones del usuario' });
    }
  },

agregarProfesionesUsuario: async (req, res) => {
    const t = await db.sequelize.transaction(); // Inicia una transacción
  
    try {
      const { idUsuario, profesiones } = req.body;
  
      // Verifica que el usuario es un prestador
      const usuario = await db.Usuario.findOne({ where: { idUsuario }, transaction: t });
      if (!usuario || !usuario.esPrestador) {
        await t.rollback(); // Revierte la transacción en caso de error
        return res.status(400).json({ message: 'El usuario no es un prestador' });
      }
  
      // Agrega las profesiones al usuario
      for (const nombreProfesion of profesiones) {
        const profesionExistente = await db.Profesion.findOne({
          where: { nombreProfesion: nombreProfesion.toLowerCase() },
          transaction: t,
        });
  
        if (profesionExistente) {
          const profesionUsuarioExistente = await db.PrestadorProfesiones.findOne({
            where: { idprestador: idUsuario, idProfesion: profesionExistente.idProfesion },
            transaction: t,
          });
          if (profesionUsuarioExistente) {
            await t.rollback(); // Revierte la transacción en caso de error
            return res.status(400).json({ message: 'La profesión ya existe para este usuario' });
          }
        }
  
        const [profesion] = await db.Profesion.findOrCreate({
          where: { nombreProfesion: nombreProfesion.toLowerCase() },
          transaction: t,
        });
  
        await db.PrestadorProfesiones.create({ idprestador: idUsuario, idProfesion: profesion.idProfesion }, { transaction: t });
      }
  
      await t.commit(); // Confirma la transacción si todo está bien
      res.status(200).json({ message: 'Profesión agregada con éxito' });
    } catch (error) {
      console.error(error);
      await t.rollback(); // Revierte la transacción en caso de error
      res.status(500).json({ message: 'Error al agregar la profesion al usuario' });
    }
  },
  

  eliminarProfesionUsuario: async (req, res) => {
    const t = await db.sequelize.transaction(); // Inicia la transacción
  
    try {
      const { idUsuario, profesion } = req.body;
  
      // Asegúrate de que el usuario es un prestador
      const usuario = await db.Usuario.findOne({ where: { idUsuario } });
      if (!usuario || !usuario.esPrestador) {
        await t.rollback(); // Revierte la transacción
        return res.status(400).json({ message: 'El usuario no es un prestador' });
      }
  
      // Encuentra la profesión en la base de datos
      const profesionEncontrada = await db.Profesion.findOne({ where: { nombreProfesion: profesion.toLowerCase() } });
  
      if (!profesionEncontrada) {
        await t.rollback(); // Revierte la transacción
        return res.status(400).json({ message: 'La profesión no existe' });
      }
  
      // Elimina la relación entre el prestador y la profesión
      await db.PrestadorProfesiones.destroy({
        where: {
          idprestador: idUsuario,
          idProfesion: profesionEncontrada.idProfesion
        },
        transaction: t // Asocia la transacción con la operación
      });
  
      await t.commit(); // Confirma la transacción
      res.status(200).json({ message: 'Profesión eliminada con éxito' });
    } catch (error) {
      console.error(error);
      await t.rollback(); // Revierte la transacción en caso de error
      res.status(500).json({ message: 'Error al eliminar la profesión del usuario' });
    }
  },
  

  modificarDatosPersonales: async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, email, fechaNacimiento } = req.body;
    const t = await db.sequelize.transaction(); // Inicia la transacción
  
    try {
      const usuario = await db.Usuario.findByPk(id);
      if (!usuario) {
        await t.rollback(); // Revierte la transacción
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      // Verificar si el correo electrónico ya está en uso solo si el correo electrónico ha cambiado
      if (email !== usuario.email) {
        const existingUser = await db.Usuario.findOne({ where: { email } });
        if (existingUser) {
          await t.rollback(); // Revierte la transacción
          return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
        }
      }
  
      // Actualizar los campos que han cambiado
      if (nombre !== undefined) usuario.nombre = nombre;
      if (apellido !== undefined) usuario.apellido = apellido;
      if (email !== undefined) usuario.email = email;
      if (fechaNacimiento !== undefined) usuario.fechaNacimiento = fechaNacimiento;
  
      await usuario.save({ transaction: t }); // Asocia la transacción con la operación
  
      await t.commit(); // Confirma la transacción
      res.json({ success: true, message: 'Datos personales actualizados con éxito' });
    } catch (error) {
      console.error('Error al actualizar los datos personales:', error);
      await t.rollback(); // Revierte la transacción en caso de error
      return res.status(500).json({ error: 'Error al actualizar los datos personales' });
    }
  },
  
// Controlador para verificar la contraseña actual
 verifyPassword: async (req, res) => {
  const { idUsuario, currentPassword } = req.body;
  const t = await db.sequelize.transaction(); // Inicia la transacción

  try {
    // Busca el usuario en la base de datos
    const user = await db.Usuario.findByPk(idUsuario, { transaction: t });

    if (!user) {
      await t.rollback(); // Revierte la transacción
      return res.status(404).json(jsonResponse(404, { message: 'Usuario no encontrado' }));
    }

    // Compara la contraseña actual proporcionada con la almacenada en la base de datos
    const passwordMatch = await bcrypt.compare(currentPassword, user.contrasena);

    if (passwordMatch) {
      // La contraseña actual es correcta
      await t.commit(); // Confirma la transacción
      return res.status(200).json(jsonResponse(200, { message: 'Contraseña actual verificada' }));
    } else {
      // La contraseña actual es incorrecta
      await t.rollback(); // Revierte la transacción
      return res.status(400).json(jsonResponse(400, { message: 'Contraseña actual incorrecta' }));
    }
  } catch (error) {
    console.error('Error al verificar la contraseña actual:', error);
    await t.rollback(); // Revierte la transacción en caso de error
    return res.status(500).json(jsonResponse(500, { message: 'Error al verificar la contraseña actual' }));
  }
},

// Controlador para cambiar la contraseña
changePassword: async (req, res) => {
  const { idUsuario, newPassword } = req.body;
  const t = await db.sequelize.transaction(); // Inicia la transacción

  try {
    // Busca el usuario en la base de datos
    const user = await db.Usuario.findByPk(idUsuario, { transaction: t });

    if (!user) {
      await t.rollback(); // Revierte la transacción
      return res.status(404).json(jsonResponse(404, { message: 'Usuario no encontrado' }));
    }

    // Hashea la nueva contraseña antes de guardarla
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualiza la contraseña del usuario con la nueva contraseña hasheada
    user.contrasena = hashedPassword;
    await user.save({ transaction: t });

    await t.commit(); // Confirma la transacción

    return res.status(200).json(jsonResponse(200, { message: 'Contraseña cambiada con éxito' }));
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    await t.rollback(); // Revierte la transacción en caso de error
    return res.status(500).json(jsonResponse(500, { message: 'Error al cambiar la contraseña' }));
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
