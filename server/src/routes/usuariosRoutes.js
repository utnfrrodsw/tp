const express = require("express");
const router = express.Router();

console.log("usuariosRoutes");


const usuarioController = require( "../controllers/usuarios/usuariosControllers.js");
const {authenticate} = require("../auth/authenticate.js");
const { jsonResponse } = require("../lib/jsonResponse.js");
// const { authUserRegister } = require( "../../middlewares/usuarios/authUserRegister.js");
//const { authenticateUser } = require( "../../middlewares/usuarios/authenticateUser.js");
//const { errorHandler } = require( "../../middlewares/usuarios/errorHandler.js");
//const { validateLoginData } = require( "../../middlewares/usuarios/validateLoginData.js");
//const { validateRegistro } = require( "../../middlewares/usuarios/validateRegistro.js");


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
router.post('/login',usuarioController.login);
router.post('/logout',usuarioController.logout);

//consultas
router.get('/listaUsuarios',usuarioController.getUsuarios) 
router.get('/listaUsuario/:id', usuarioController.getUsuario)

 
//GET obtener usuarios
//POST crear usuarios
//.DELETE para eliminar 
//.PUT para actualizacion completa
//.PATCH para actualizacion parcial (ver ejemplos en el video)

module.exports=router;