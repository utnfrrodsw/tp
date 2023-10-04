const express = require("express");
const router = express.Router();
const editorialController = require("../controllers/editorial");
const { check } = require("express-validator"); // Validación de datos de entrada

router.get("/", editorialController.getAllEditoriales);
router.get("/:id", editorialController.getEditorialById);

// Ruta para crear una editorial con validación de datos de entrada
router.post(
	"/add",
	[
		// Validación de campos
		check("descripcion")
			.notEmpty()
			.withMessage("La descripción es obligatoria"),
		check("direccion")
			.notEmpty()
			.withMessage("La dirección es obligatoria"),
	],
	editorialController.createEditorial
);

router.put("/edit/:id", editorialController.updateEditorial);
router.delete("/delete/:id", editorialController.deleteEditorial);

module.exports = router;
