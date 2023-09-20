const express = require("express");
const libroRouter = express.Router();
const lc = require("../controllers/libro");
const { check } = require("express-validator");

const validators = [
	check("titulo").notEmpty().withMessage("El título es obligatorio"),
	//check("autor").notEmpty().withMessage("El autor es obligatorio"),
	check("precio").isNumeric().withMessage("El precio debe ser numérico"),
];

libroRouter.get("/", lc.getLibros);
libroRouter.get("/id/:id", lc.getLibro);
libroRouter.post("/add", validators, lc.createLibro);
libroRouter.put("/edit/:id", lc.updateLibro);
libroRouter.delete("/delete/:id", lc.deleteLibro);

module.exports = libroRouter;
