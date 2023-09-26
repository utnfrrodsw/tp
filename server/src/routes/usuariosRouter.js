//MANEJO DE RUTAS

import { Router } from "express";
import { getUsuario, getUsuarios } from "../controllers/usuariosControllers.js";

const router = Router ()

router.get('/usuarios',getUsuarios) 
router.get('/usuarios/:id', getUsuario)

//GET obtener usuarios
//POST crear usuarios
//.DELETE para eliminar 
//.PUT para actualizacion completa
//.PATCH para actualizacion parcial (ver ejemplos en el video)

export default router