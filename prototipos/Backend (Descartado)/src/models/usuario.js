const pool = require("../config/database");
const User = require("../schemas/usuario");
const bcrypt = require("bcrypt"); // Para hashear la contraseña

class UsuarioModel {
	constructor() {
		this.db = new Database();
	}

	async getUsuarios() {
		const sql = "SELECT * FROM usuarios";
		let conn = null;
		try {
			conn = await this.db.getConnection();
			const rows = await conn.query(sql);
			return rows.map((row) => new User(row));
		} catch (error) {
			throw new Error("Error al obtener los usuarios");
		} finally {
			if (conn) conn.release();
		}
	}

	async getUsuarioById(id) {
		const sql = "SELECT * FROM usuarios WHERE id = ?";
		let conn = null;
		try {
			conn = await this.db.getConnection();
			const [row] = await conn.query(sql, id);
			return new User(row);
		} catch (error) {
			throw new Error("Error al obtener el usuario");
		} finally {
			if (conn) conn.release();
		}
	}

	async create(data) {
		const sqlParts = [];
		const sqlPlaceholders = [];
		const sqlParams = [];

		for (const key in data) {
			const sqlParam = data[key];
			if (sqlParam) {
				sqlParts.push(key);
				sqlPlaceholders.push("?");
				sqlParams.push(data[key]);
			} else {
				sqlParams.push(null);
			}
		}

		const contrasenaHasheada = await bcrypt.hash(data.contrasena, 10);

		sqlParts.push("contrasena");
		sqlPlaceholders.push("?");
		sqlParams.push(contrasenaHasheada);

		const sql = `
    INSERT INTO usuarios(${sqlParts.join(", ")})
    VALUES(${sqlPlaceholders.join(", ")})
    `;

		let conn = null;

		try {
			conn = await this.db.getConnection();
			const result = await conn.query(sql, sqlParams);
			return result.insertId;
		} catch (error) {
			throw new Error("Error al crear el usuario");
		} finally {
			if (conn) conn.release();
		}
	}

	async update(id, data) {
		const sqlParts = [];
		const sqlParams = [];

		for (const key in data) {
			const sqlParam = data[key];
			if (sqlParam) {
				sqlParts.push(`${key} = ?`);
				sqlParams.push(data[key]);
			}
		}

		if (sqlParams.length === 0) {
			return null;
		}

		const sql = `
      UPDATE usuarios
      SET ${sqlParts.join(", ")}
      WHERE id = ?
  `;

		sqlParams.push(id);

		let conn = null;

		try {
			conn = await this.db.getConnection();
			const result = await conn.query(sql, sqlParams);
			return result.affectedRows;
		} catch (error) {
			throw new Error("Error al actualizar el usuario");
		} finally {
			if (conn) conn.release();
		}
	}

	async deleteUser(id) {
		const sql = "DELETE FROM usuarios WHERE id = ?";

		let conn = null;

		try {
			conn = await this.db.getConnection();
			result = await conn.query(sql, id);
			return result.affectedRows;
		} catch (error) {
			throw new Error("Error al borrar el usuario");
		} finally {
			if (conn) conn.release();
		}
	}

	// Para validar que no se repita el correo al registrar un nuevo usuario
	async getUsuarioByEmail(email) {
		const sql = "SELECT * FROM usuarios WHERE email = ?";
		let conn = null;
		try {
			conn = await this.db.getConnection();
			const [row] = await conn.query(sql, email);
			return row;
		} catch (error) {
			return null;
		} finally {
			if (conn) conn.release();
		}
	}
}

module.exports = new UsuarioModel();
