const express = require("express");
const router = express.Router();

const usuarioController = require( "../controllers/usuarios/usuariosControllers.js");

// const { authUserRegister } = require( "../../middlewares/usuarios/authUserRegister.js");
//const { authenticateUser } = require( "../../middlewares/usuarios/authenticateUser.js");
//const { errorHandler } = require( "../../middlewares/usuarios/errorHandler.js");
//const { validateLoginData } = require( "../../middlewares/usuarios/validateLoginData.js");
//const { validateRegistro } = require( "../../middlewares/usuarios/validateRegistro.js");

router.get('/', (req, res) => {
    res.send('usuarios');
});

//login, register
router.post('/registrar',usuarioController.registrarUsuario);
router.post('/login',usuarioController.login);

//consultas
router.get('/listaUsuarios',usuarioController.getUsuarios) 
router.get('/listaUsuarios/:id', usuarioController.getUsuario)

 
//GET obtener usuarios
//POST crear usuarios
//.DELETE para eliminar 
//.PUT para actualizacion completa
//.PATCH para actualizacion parcial (ver ejemplos en el video)

module.exports=router;