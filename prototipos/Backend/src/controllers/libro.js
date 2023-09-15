// Importar lm y otras dependencias
const lm = require("../models/libro");
// Para validar datos de entrada
const { validationResult } = require("express-validator");

//función de manejo de errores para evitar duplicar código y facilitar la mantenibilidad
function handleError(res, errorMessage) {
	res.status(500).json({ success: false, msg: errorMessage });
}

// Función de utilidad 'response' para simplificar la creación de objetos de respuesta JSON
const response = (success, data = null, msg = "") => ({
	success,
	data,
	msg,
});

module.exports = {
	async getLibros(req, res) {
		try {
			const libros = await lm.getLibros();
			if (!libros) {
				res.status(404).json(
					response(false, null, "No existen libros")
				);
				return;
			}
			res.json(response(true, libros));
		} catch (error) {
			handleError(res, "Error al obtener los libros");
		}
	},

	async getLibro(req, res) {
		const id = parseInt(req.params.id);
		try {
			const libro = await lm.getLibroById(id);
			if (!libro) {
				res.status(404).json({
					success: false,
					msg: "No existe el libro",
				});
				return;
			}
			res.json({ success: true, data: libro });
		} catch (error) {
			res.status(500).json({
				success: false,
				msg: "Error al obtener el libro",
			});
		}
	},

	async createLibro(req, res) {
		// Validación de datos de entrada
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json(response(false, null, "Datos de entrada inválidos"));
		}
		const data = req.body;
		try {
			const id = await lm.createLibro(data);
			res.json(response(true, null, `Libro ${id} creado con éxito`));
		} catch (error) {
			handleError(res, "Error al crear el libro");
		}
	},

	async updateLibro(req, res) {
		const id = parseInt(req.params.id);
		const data = req.body;
		try {
			const affectedRows = await lm.updateLibro(id, data);
			if (!affectedRows) {
				res.status(404).json(
					response(false, null, "No existe el libro indicado")
				);
				return;
			}
			res.json(response(true, null, "Libro actualizado con éxito"));
		} catch (error) {
			handleError(res, "Error al actualizar el libro");
		}
	},

	async deleteLibro(req, res) {
		const id = req.params.id;
		try {
			const affectedRows = await lm.deleteLibro(id);
			if (!affectedRows) {
				res.status(404).json(
					response(false, null, "No existe el libro indicado")
				);
				return;
			}
			res.json(response(true, null, "Libro borrado con éxito"));
		} catch (error) {
			handleError(res, "Error al borrar el libro");
		}
	},
};
