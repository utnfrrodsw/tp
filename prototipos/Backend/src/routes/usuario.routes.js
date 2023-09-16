const express = require("express");
const usuarioRouter = express.Router();
const uc = require("../controllers/usuario");
const { check } = require("express-validator"); // Importar validación de datos

usuarioRouter.get("/", uc.getUsuarios);
usuarioRouter.get("/id/:id", uc.getUsuario);

// Ruta para crear un usuario con validación de datos de entrada
usuarioRouter.post(
	"/add",
	[
		// Validación de campos
		check("nombre").notEmpty().withMessage("El nombre es obligatorio"),
		check("correo").isEmail().withMessage("El correo debe ser válido"),
		check("contrasena")
			.isLength({ min: 8 })
			.withMessage("La contraseña debe tener al menos 8 caracteres"),
	],
	uc.createUsuario
);

usuarioRouter.put("/edit/:id", uc.updateUsuario);
usuarioRouter.delete("/delete/:id", uc.deleteUsuario);

module.exports = usuarioRouter;
