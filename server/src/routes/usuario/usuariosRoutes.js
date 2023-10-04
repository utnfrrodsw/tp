
//MANEJO DE RUTAS

const express = require("express");
const router = express.Router();

const usuarioController = require( "../../controllers/usuarios/usuariosControllers.js");

// const { authUserRegister } = require( "../../middlewares/usuarios/authUserRegister.js");
//const { authenticateUser } = require( "../../middlewares/usuarios/authenticateUser.js");
//const { errorHandler } = require( "../../middlewares/usuarios/errorHandler.js");
//const { validateLoginData } = require( "../../middlewares/usuarios/validateLoginData.js");
//const { validateRegistro } = require( "../../middlewares/usuarios/validateRegistro.js");

 
router.get('/usuarios/listaUsuarios',usuarioController.getUsuarios) 
router.get('/usuarios/listaUsuarios/:id', usuarioController.getUsuario)

 

// RUTA REGISTRO DE USUARIOS
router.post('/usuarios/registro',/* validateRegistro,  authUserRegister, */usuarioController.registrarUsuario /*, errorHandler*/);

//RUTA LOGIN USUARIOS
router.post('/usuarios/login', /*validateLoginData, authenticateUser, */usuarioController.login /*,errorHandler*/);

//GET obtener usuarios
//POST crear usuarios
//.DELETE para eliminar 
//.PUT para actualizacion completa
//.PATCH para actualizacion parcial (ver ejemplos en el video)

module.exports=router;