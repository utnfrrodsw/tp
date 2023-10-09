const express = require("express");
const usuarioRouter = express.Router();
const uc = require("../controllers/usuario");
const { check } = require("express-validator");

usuarioRouter.get("/", uc.getUsuarios);
usuarioRouter.get("/id/:id", uc.getUsuario);

const validators = [
	check("nombre").notEmpty().withMessage("El nombre es obligatorio"),
	check("apellido").notEmpty().withMessage("El apellido es obligatorio"),
	check("email").isEmail().withMessage("El email debe ser válido"),
	check("contrasena")
		.isLength({ min: 8 })
		.withMessage("La contraseña debe tener al menos 8 caracteres"),
	check("direccion").notEmpty().withMessage("La dirección es obligatoria"),
	check("localidad").notEmpty().withMessage("La localidad es obligatoria"),
	check("avatar").notEmpty().withMessage("El avatar es obligatorio"),
	check("tipo").notEmpty().withMessage("El tipo es obligatorio"),
];

usuarioRouter.get("/", uc.getUsuarios);
usuarioRouter.get("/id/:id", uc.getUsuario);
usuarioRouter.post("/add", validators, uc.createUsuario);
usuarioRouter.put("/edit/:id", uc.updateUsuario);
usuarioRouter.delete("/delete/:id", uc.deleteUsuario);

module.exports = usuarioRouter;
