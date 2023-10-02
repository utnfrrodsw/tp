//MANEJO DE RUTAS

import { Router } from "express";
import { login } from "../../controllers/usuarios/loginController.js";
import { registrarUsuario } from "../../controllers/usuarios/registerController.js";
import { getUsuario, getUsuarios } from "../../controllers/usuarios/usuariosControllers.js";
import { authUserRegister } from "../../middlewares/usuarios/authUserRegister.js";
import { authenticateUser } from "../../middlewares/usuarios/authenticateUser.js";
import { errorHandler } from "../../middlewares/usuarios/errorHandler.js";
import { validateLoginData } from "../../middlewares/usuarios/validateLoginData.js";
import { validateRegistro } from "../../middlewares/usuarios/validateRegistro.js";

const router = Router ()
 
router.get('/usuarios/listaUsuarios',getUsuarios) 
router.get('/usuarios/listaUsuarios/:email', getUsuario)

 

// RUTA REGISTRO DE USUARIOS
router.post('/usuarios/registro', validateRegistro,  authUserRegister, registrarUsuario, errorHandler);

//RUTA LOGIN USUARIOS
router.post('/usuarios/login', validateLoginData, login, authenticateUser,  errorHandler)

//GET obtener usuarios
//POST crear usuarios
//.DELETE para eliminar 
//.PUT para actualizacion completa
//.PATCH para actualizacion parcial (ver ejemplos en el video)

export default router