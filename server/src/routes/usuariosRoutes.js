
//MANEJO DE RUTAS

const express = require("express");
const router = express.Router();

const usuarioController = require( "../controllers/usuarios/usuariosControllers.js");

// const { authUserRegister } = require( "../../middlewares/usuarios/authUserRegister.js");
//const { authenticateUser } = require( "../../middlewares/usuarios/authenticateUser.js");
//const { errorHandler } = require( "../../middlewares/usuarios/errorHandler.js");
//const { validateLoginData } = require( "../../middlewares/usuarios/validateLoginData.js");
//const { validateRegistro } = require( "../../middlewares/usuarios/validateRegistro.js");
const {validacionModDatosPer} = require ('../middlewares/usuarios/validacionModDatosPer.js')
const {validacionModClave} = require ('../middlewares/usuarios/validacionModClave.js')
const {verificarClave} = require ('../middlewares/usuarios/verificarClave.js')

//OBTENER USUARIOS
router.get('/listaUsuarios',usuarioController.getUsuarios) 
router.get('/listaUsuarios/:id', usuarioController.getUsuario)

 

//REGITRO
router.post('/registro',/* validateRegistro,  authUserRegister, */usuarioController.registrarUsuario /*, errorHandler*/);
//LOGIN
router.post('/login', /*validateLoginData, authenticateUser, */usuarioController.login /*,errorHandler*/);


//DATOS PERSONALES
router.get('/obtenerDatosPersonales', usuarioController.obtenerDatosUsuario ) //traigo los datos del usuario
router.patch ('/modificarDatosPersonales', validacionModDatosPer, usuarioController.modificarDatosPersonales); //modificoDatos
router.get('/verificarClave',verificarClave, usuarioController.verificarClave)  //compruebo Clave
router.patch ('/modificarClave', validacionModClave, usuarioController.cambiarClave); //actualizo clave


module.exports=router;