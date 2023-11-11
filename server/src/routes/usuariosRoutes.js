const express = require("express");
const router = express.Router();

//controllers
const usuarioController = require("../controllers/usuarios/usuariosControllers.js");
const { cargarFotoPerfil,obtenerFotoPerfil, upload } = require("../controllers/usuarios/manejoFotos.js");

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
router.get('/obtenerDatosPersonales/:id', usuarioController.obtenerDatosUsuario);
router.put('/modificarDatosPersonales/:id', usuarioController.modificarDatosPersonales); 

//foto de perfil
router.put('/cargarFotoPerfil/:id', upload.single('file'), cargarFotoPerfil);
router.get('/obtenerFotoPerfil/:id', obtenerFotoPerfil);

//profesiones
router.get('/obtenerProfesionesUsuario/:id', usuarioController.obtenerProfesionesUsuario);
router.post('/agregarProfesionesUsuario/:id', usuarioController.agregarProfesionesUsuario);
router.delete('/eliminarProfesionUsuario/:id', usuarioController.eliminarProfesionUsuario);

module.exports = router;