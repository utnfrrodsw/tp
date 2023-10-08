const Database = require("../config/database");
const User = require("../schemas/libro");

class LibroModel {
	constructor() {
		this.db = new Database();
	}

	async getLibros() {
		const sql = "SELECT * FROM libros";

		let conn = null;

		try {
			conn = await this.db.getConnection();
			const rows = await conn.query(sql);
			return rows.map((row) => new User(row));
		} catch (error) {
			throw new Error("Error al obtener los libros");
		} finally {
			if (conn) conn.release();
		}
	}

	async getLibro(id) {
		const sql = "SELECT * FROM libros WHERE id = ?";

		let conn = null;

		try {
			conn = await this.db.getConnection();
			const [row] = await conn.query(sql, id);
			return new User(row);
		} catch (error) {
			throw new Error("Error al obtener el libro");
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

		const sql = `
            INSERT INTO libros(${sqlParts.join(", ")})
            VALUES (${sqlPlaceholders.join(", ")})
        `;

		let conn = null;

		try {
			conn = await this.db.getConnection();
			const result = await conn.query(sql, sqlParams);
			return result.insertId;
		} catch (error) {
			throw new Error("Error al crear el libro");
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
            UPDATE libros
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
			throw new Error("Error al actualizar el libro");
		} finally {
			if (conn) conn.release();
		}
	}

	async delete(id) {
		const sql = "DELETE FROM libros WHERE id = ?";

		let conn = null;

		try {
			conn = await this.db.getConnection();
			result = await conn.query(sql, id);
			return result.affectedRows;
		} catch (error) {
			throw new Error("Error al borrar el libro");
		} finally {
			if (conn) conn.release();
		}
	}
}

module.exports = new LibroModel();
