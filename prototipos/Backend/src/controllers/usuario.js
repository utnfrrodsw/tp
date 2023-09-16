const um = require("../models/usuario");
const { validationResult } = require("express-validator"); // Importar validación de datos
const { handleError, response } = require("../utils/helpers"); // Importar funciones de utilidad

module.exports = {
	async getUsuarios(req, res) {
		try {
			const usuarios = await um.getUsuarios();
			if (!usuarios) {
				return res
					.status(404)
					.json(response(false, null, "No existen usuarios"));
			}
			res.json(response(true, usuarios));
		} catch (error) {
			handleError(res, "Error al obtener los usuarios");
		}
	},

	async getUsuario(req, res) {
		const id = parseInt(req.params.id);
		try {
			const usuario = await um.getUsuarioById(id);
			if (!usuario) {
				return res
					.status(404)
					.json(response(false, null, "No existe el usuario"));
			}
			res.json(response(true, usuario));
		} catch (error) {
			handleError(res, "Error al obtener el usuario");
		}
	},

	async createUsuario(req, res) {
		// Validación de datos de entrada
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(response(false, null, errors.array()));
		}

		const { nombre, correo, contrasena } = req.body;

		// Validar contraseña con expresión regular
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
		if (!passwordRegex.test(contrasena)) {
			return res
				.status(400)
				.json(
					response(
						false,
						null,
						"La contraseña debe tener al menos 8 caracteres y contener al menos una letra mayúscula y una minúscula."
					)
				);
		}

		try {
			// Verificar si el correo electrónico ya está en uso
			const existingUser = await um.getUsuarioPorCorreo(correo);
			if (existingUser) {
				return res
					.status(400)
					.json(
						response(
							false,
							null,
							"El correo electrónico ya está en uso"
						)
					);
			}
			const id = await um.createUsuario({ nombre, correo, contrasena });
			res.json(response(true, null, `Usuario ${id} creado`));
		} catch (error) {
			handleError(res, "Error al crear el usuario");
		}
	},

	async updateUsuario(req, res) {
		const id = parseInt(req.params.id);
		const data = req.body;
		try {
			const affectedRows = await um.updateUsuario(id, data);
			if (!affectedRows) {
				return res
					.status(404)
					.json(
						response(false, null, "No existe el usuario indicado")
					);
			}
			res.json(response(true, null, "Usuario actualizado"));
		} catch (error) {
			handleError(res, "Error al actualizar el usuario");
		}
	},

	async deleteUsuario(req, res) {
		const id = req.params.id;
		try {
			const affectedRows = await um.deleteUsuario(id);
			if (!affectedRows) {
				return res
					.status(404)
					.json(
						response(false, null, "No existe el usuario indicado")
					);
			}
			res.json(response(true, null, "Usuario borrado"));
		} catch (error) {
			handleError(res, "Error al borrar el usuario");
		}
	},
};
