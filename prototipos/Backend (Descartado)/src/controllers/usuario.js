const um = require("../models/usuario");
const { validationResult } = require("express-validator");
const { isValidID } = require("../utils/validators");
const {
	handleError,
	response,
	sanitizeInputParams,
} = require("../utils/helpers");

class UsuarioController {
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
			console.log(error);
			handleError(res, error.toString());
		}
	}

	async getUsuario(req, res) {
		const id = req.params.id;
		if (!isValidID(id)) {
			return res.status(400).json(response(false, null, "ID inválido"));
		}
		try {
			const usuario = await um.getUsuario(id);
			if (!usuario) {
				return res
					.status(404)
					.json(response(false, null, "No existe el usuario"));
			}
			res.json(response(true, usuario));
		} catch (error) {
			handleError(res, error);
		}
	}

	async createUsuario(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json(response(false, null, "Datos de entrada inválidos"));
		}

		const {
			nombre,
			apellido,
			email,
			contrasena,
			direccion,
			id_localidad,
			avatar,
			tipo,
		} = req.body;

		const toCreate = sanitizeInputParams({
			nombre,
			apellido,
			email,
			contrasena,
			direccion,
			id_localidad,
			avatar,
			tipo,
		});

		const validarContrasena = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
		if (!validarContrasena.test(contrasena)) {
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
			const existeUsuario = await um.getUsuarioByEmail(email);
			if (existeUsuario !== null) {
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
			const id = await um.create(toCreate);
			res.json(response(true, null, `Usuario ${id} creado con éxito`));
		} catch (error) {
			console.log(error);
			handleError(res, "Error al crear el usuario");
		}
	}

	async updateLibro(req, res) {
		const id = req.params.id;
		if (!isValidID(id)) {
			return res.status(400).json(response(false, null, "ID inválido"));
		}

		const {
			nombre,
			apellido,
			email,
			contrasena,
			direccion,
			id_localidad,
			avatar,
			tipo,
		} = req.body;

		const toUpdate = sanitizeInputParams({
			nombre,
			apellido,
			email,
			contrasena,
			direccion,
			id_localidad,
			avatar,
			tipo,
		});

		try {
			const result = await um.update(id, toUpdate);

			if (result === null) {
				return res
					.status(400)
					.json(
						response(false, null, "No hay campos para actualizar")
					);
			}

			if (result === 0) {
				return res
					.status(404)
					.json(
						response(false, null, "No existe el usuario indicado")
					);
			}
			res.json(response(true, null, "Usuario actualizado con éxito"));
		} catch (error) {
			handleError(res, error.toString());
		}
	}

	async deleteUsuario(req, res) {
		const id = req.params.id;
		if (!isValidID(id)) {
			return res.status(400).json(response(false, null, "ID inválido"));
		}
		try {
			const result = await um.delete(id);
			if (!result) {
				return res
					.status(404)
					.json(
						response(false, null, "No existe el usuario indicado")
					);
			}
			res.json(response(true, null, "Usuario borrado con éxito"));
		} catch (error) {
			console.log(error);
			handleError(res, "Error al borrar el usuario");
		}
	}
}

module.exports = new UsuarioController();
