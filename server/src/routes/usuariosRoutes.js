const express = require("express");
const router = express.Router();

//controllers
const usuarioController = require("../controllers/usuarios/usuariosControllers.js");
const { cargarFotoPerfil,obtenerFotoPerfil, upload } = require("../controllers/usuarios/manejoFotos.js");

const { authenticate } = require("../auth/authenticate.js");
const { jsonResponse } = require("../lib/jsonResponse.js");
const { validateRegister } = require("../middlewares/usuarios/validateRegistro.js");
const { validateUserData,validateFotoPerfil  } = require("../middlewares/usuarios/validacionDatosUser.js");
const { validateProfesionesUsuario } = require("../middlewares/usuarios/validacionProfesion.js");
const { validacionCambioClave } = require("../middlewares/usuarios/validacionCambioClave.js");
const { validateResetPassword } = require("../middlewares/usuarios/validacionResetPassword.js");
const {validateLogin} = require("../middlewares/usuarios/validacionLogin.js");
const {validacionPreCambioClave} = require ("../middlewares/usuarios/validacionPreCambioClave.js");


router.get('/', (req, res) => {
  res.send('usuarios');
});

// Tokens
router.post('/refreshToken', usuarioController.refreshToken); // post Refresh token
router.get('/auth', authenticate,  (req, res) => { // get Auth
  res.status(200).json(jsonResponse(200, req.user));
});

// Login, register
router.post('/login',validateLogin, usuarioController.login);
router.delete('/logout', usuarioController.logout);
router.post('/register',validateRegister, usuarioController.register);

// Restablecimiento de contraseña
router.post('/reset-password/request',validacionPreCambioClave, usuarioController.passwordReset);
router.post('/reset-password', validateResetPassword, usuarioController.resetPassword);

// Ruta para verificar la contraseña actual
router.post('/verify-password', usuarioController.verifyPassword);
// Ruta para cambiar la contraseña
router.post('/change-password', validacionCambioClave, usuarioController.changePassword);

// Consultas
router.get('/listaUsuarios', usuarioController.getUsuarios);
router.get('/listaUsuario/:id', usuarioController.getUsuario);

// Datos personales
router.get('/obtenerDatosPersonales/:id', usuarioController.obtenerDatosUsuario);
router.put('/modificarDatosPersonales/:id', validateUserData,  usuarioController.modificarDatosPersonales);

//foto de perfil
router.put('/cargarFotoPerfil/:id', upload.single('file'),validateFotoPerfil, cargarFotoPerfil);
router.get('/obtenerFotoPerfil/:id', obtenerFotoPerfil);

//profesiones
router.get('/obtenerProfesionesUsuario/:id', usuarioController.obtenerProfesionesUsuario);
router.post('/agregarProfesionesUsuario/:id', validateProfesionesUsuario,usuarioController.agregarProfesionesUsuario);
router.delete('/eliminarProfesionUsuario/:id', usuarioController.eliminarProfesionUsuario);

 

module.exports = router;