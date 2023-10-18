const express = require("express");
const router = express.Router();

//controllers

const usuarioController = require( "../controllers/usuarios/usuariosControllers.js");

const {authenticate} = require("../auth/authenticate.js");
const { jsonResponse } = require("../lib/jsonResponse.js");
// const { authUserRegister } = require( "../../middlewares/usuarios/authUserRegister.js");
//const { authenticateUser } = require( "../../middlewares/usuarios/authenticateUser.js");
//const { errorHandler } = require( "../../middlewares/usuarios/errorHandler.js");
//const { validateLoginData } = require( "../../middlewares/usuarios/validateLoginData.js");
//const { validateRegistro } = require( "../../middlewares/usuarios/validateRegistro.js");
const {validacionModDatosPer} = require ('../middlewares/usuarios/validacionModDatosPer.js')
const {validacionModClave} = require ('../middlewares/usuarios/validacionModClave.js')
const {verificarClave} = require ('../middlewares/usuarios/verificarClave.js')


router.get('/', (req, res) => {
    res.send('usuarios');
});

//tokens

router.post('/refreshToken', usuarioController.refreshToken);
router.get('/auth', authenticate,  (req, res) => {
    res.status(200).json(jsonResponse(200, req.user));
});

//login, register
router.post('/registrar',usuarioController.registrarUsuario);
router.post('/login' ,usuarioController.login);
router.delete('/logout',usuarioController.logout);

//consultas
//OBTENER USUARIOS
router.get('/listaUsuarios',usuarioController.getUsuarios) 
router.get('/listaUsuario/:id', usuarioController.getUsuario)

 
//GET obtener usuarios
//POST crear usuarios
//.DELETE para eliminar 
//.PUT para actualizacion completa
//.PATCH para actualizacion parcial (ver ejemplos en el video)

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