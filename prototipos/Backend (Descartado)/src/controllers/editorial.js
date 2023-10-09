const Editorial = require("../models/editorial");
// Para validar datos de entrada
const { validationResult } = require("express-validator");
// Importar función de manejo de errores y de utilidad 'response'
const { handleError, response } = require("../utils/helpers");

// Obtener todas las editoriales
async function getAllEditoriales(req, res, next) {
	try {
		const editoriales = await Editorial.getAll();
		if (editoriales.length === 0) {
			return res
				.status(404)
				.json(response(false, null, "No existen editoriales."));
		}
		res.json(response(true, editoriales));
	} catch (error) {
		handleError(res, "Error al obtener las editoriales.");
	}
}

// Obtener una editorial por su ID
async function getEditorialById(req, res, next) {
	const { id } = req.params;
	try {
		const editorial = await Editorial.getById(id);
		if (!editorial) {
			return res
				.status(404)
				.json(response(false, null, "No existe la editorial."));
		}
		res.json(response(true, editorial));
	} catch (error) {
		handleError(res, "Error al obtener la editorial.");
	}
}

// Crear una nueva editorial
async function createEditorial(req, res, next) {
	const { descripcion, direccion } = req.body;
	try {
		const nuevaEditorial = new Editorial(null, descripcion, direccion);
		await nuevaEditorial.save();
		res.status(201).json(
			response(
				true,
				nuevaEditorial,
				`Editorial '${descripcion}' creada con éxito.`
			)
		);
	} catch (error) {
		handleError(res, "Error al crear una nueva editorial.");
	}
}

// Actualizar una editorial existente
async function updateEditorial(req, res, next) {
	const { id } = req.params;
	const { descripcion, direccion } = req.body;
	try {
		const editorial = await Editorial.getById(id);
		if (!editorial) {
			return res
				.status(404)
				.json(response(false, null, "No existe la editorial."));
		}
		editorial.descripcion = descripcion;
		editorial.direccion = direccion;
		await editorial.update();
		res.json(
			response(
				true,
				editorial,
				`Editorial '${descripcion}' actualizada con éxito.`
			)
		);
	} catch (error) {
		handleError(res, "Error al actualizar la editorial.");
	}
}

// Eliminar una editorial
async function deleteEditorial(req, res, next) {
	const { id } = req.params;
	try {
		const editorial = await Editorial.getById(id);
		if (!editorial) {
			return res
				.status(404)
				.json(response(false, null, "No existe la editorial."));
		}
		await editorial.delete();
		res.json(response(true, null, "Editorial eliminada con éxito."));
	} catch (error) {
		handleError(res, "Error al eliminar la editorial.");
	}
}

module.exports = {
	getAllEditoriales,
	getEditorialById,
	createEditorial,
	updateEditorial,
	deleteEditorial,
};
