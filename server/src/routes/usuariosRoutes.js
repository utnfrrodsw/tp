const express = require("express");
const router = express.Router();

//controllers

const usuarioController = require( "../controllers/usuarios/usuariosControllers.js");

const { authenticate } = require("../auth/authenticate.js");
const { jsonResponse } = require("../lib/jsonResponse.js");
const { validacionModDatosPer } = require('../middlewares/usuarios/validacionModDatosPer.js');
const { validacionModClave } = require('../middlewares/usuarios/validacionModClave.js');
const { verificarClave } = require('../middlewares/usuarios/verificarClave.js');

router.get('/', (req, res) => {
  res.send('usuarios');
});

// Tokens

router.post('/refreshToken', usuarioController.refreshToken);
router.get('/auth', authenticate,  (req, res) => {
  res.status(200).json(jsonResponse(200, req.user));
});

// Login, register

router.post('/login', usuarioController.login);
router.delete('/logout', usuarioController.logout);
router.post('/register', usuarioController.register);

// Restablecimiento de contraseña
router.post('/reset-password/request', usuarioController.passwordReset);
router.post('/reset-password', usuarioController.resetPassword);


// Ruta para verificar la contraseña actual
router.post('/verify-password', usuarioController.verifyPassword);
// Ruta para cambiar la contraseña
router.post('/change-password', usuarioController.changePassword);



// Consultas

router.get('/listaUsuarios', usuarioController.getUsuarios);
router.get('/listaUsuario/:id', usuarioController.getUsuario);

// Datos personales

router.get('/obtenerDatosPersonales', usuarioController.obtenerDatosUsuario);
router.patch('/modificarDatosPersonales', validacionModDatosPer, usuarioController.modificarDatosPersonales);
 

module.exports = router;
