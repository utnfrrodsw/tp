const pool = require("../config/database");

class Editorial {
	// representa una editorial para encapsular su lógica
	constructor(id, descripcion, direccion) {
		this.id = id;
		this.descripcion = descripcion;
		this.direccion = direccion;
	}

	// Obtener todas las editoriales
	static async getAll() {
		try {
			const conn = await pool.getConnection();
			const [rows] = await conn.query("SELECT * FROM editoriales");
			conn.release(); // Liberar la conexión al finalizar

			// Mapear las filas a objetos de la clase Editorial
			return rows.map(
				(row) => new Editorial(row.id, row.descripcion, row.direccion)
			);
		} catch (error) {
			console.error("Error al obtener editoriales:", error);
			throw error;
		}
	}

	// Obtener una editorial por su ID
	static async getById(id) {
		try {
			const conn = await pool.getConnection();
			const [rows] = await conn.query(
				"SELECT * FROM editoriales WHERE id = ?",
				[id]
			);
			conn.release(); // Liberar la conexión al finalizar

			// Verificar si se encontró una editorial con el ID especificado
			if (rows.length === 0) {
				return null; // Si no se encuentra ninguna editorial con ese ID, devolvemos null
			}

			// Crear y devolver un objeto Editorial
			const row = rows[0];
			return new Editorial(row.id, row.descripcion, row.direccion);
		} catch (error) {
			console.error("Error al obtener la editorial:", error);
			throw error;
		}
	}

	// Guardar una nueva editorial en la base de datos
	async save() {
		try {
			const conn = await pool.getConnection();
			const sql =
				"INSERT INTO editoriales (descripcion, direccion) VALUES (?, ?)";
			const [result] = await conn.query(sql, [
				this.descripcion,
				this.direccion,
			]);
			conn.release(); // Liberar la conexión al finalizar

			// Actualizar el ID de la instancia con el ID generado por la base de datos
			this.id = result.insertId;
			return this; // Devolver la instancia actualizada
		} catch (error) {
			console.error("Error al crear una nueva editorial:", error);
			throw error;
		}
	}

	// Actualizar los datos de una editorial en la base de datos
	async update() {
		try {
			const conn = await pool.getConnection();
			const sql =
				"UPDATE editoriales SET descripcion = ?, direccion = ? WHERE id = ?";
			const [result] = await conn.query(sql, [
				this.descripcion,
				this.direccion,
				this.id,
			]);
			conn.release(); // Liberar la conexión al finalizar

			return result.affectedRows;
		} catch (error) {
			console.error("Error al actualizar la editorial:", error);
			throw error;
		}
	}

	// Eliminar una editorial de la base de datos
	async delete() {
		try {
			const conn = await pool.getConnection();
			const sql = "DELETE FROM editoriales WHERE id = ?";
			const [result] = await conn.query(sql, [this.id]);
			conn.release(); // Liberar la conexión al finalizar

			return result.affectedRows;
		} catch (error) {
			console.error("Error al eliminar la editorial:", error);
			throw error;
		}
	}
}

module.exports = Editorial;
