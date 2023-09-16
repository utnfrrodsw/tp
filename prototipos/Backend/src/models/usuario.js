const pool = require("../config/database");
const bcrypt = require("bcrypt"); // Importar bcrypt para hashear la contraseña

module.exports = {
	async getUsuarios() {
		conn = await pool.getConnection();
		sql = "SELECT * FROM usuarios";
		const rows = await conn.query(sql);
		conn.end();
		return rows;
	},

	async getUsuarioById(id) {
		conn = await pool.getConnection();
		sql = "SELECT * FROM usuarios WHERE id = ?";
		const rows = await conn.query(sql, id);
		conn.end();
		return rows[0];
	},

	async createUsuario(data) {
		conn = await pool.getConnection();
		const hashedPassword = await bcrypt.hash(data.contrasena, 10); // Hash de la contraseña
		sql = `
      INSERT INTO usuarios(nombre, apellido, email, contrasena, direccion, id_localidad, avatar, tipo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
		const result = await conn.query(sql, [
			data.nombre,
			data.apellido,
			data.email,
			hashedPassword, // Guardar la contraseña hasheada en la base de datos
			data.direccion,
			data.id_localidad,
			data.avatar,
			data.tipo,
		]);
		conn.end();
		return result.insertId;
	},

	async updateUsuario(id, data) {
		conn = await pool.getConnection();
		if (data.contrasena) {
			// Si se proporciona una nueva contraseña, hashearla antes de actualizar
			data.contrasena = await bcrypt.hash(data.contrasena, 10);
		}
		sql = `
      UPDATE usuarios
      SET nombre = ?, apellido = ?, email = ?, contrasena = ?, direccion = ?, id_localidad = ?, avatar = ?, tipo = ?
      WHERE id = ?
    `;
		const result = await conn.query(sql, [
			data.nombre,
			data.apellido,
			data.email,
			data.contrasena,
			data.direccion,
			data.id_localidad,
			data.avatar,
			data.tipo,
			id,
		]);
		conn.end();
		return result.affectedRows;
	},

	async deleteUsuarios(id) {
		conn = await pool.getConnection();
		sql = "DELETE FROM usuarios WHERE id = ?";
		const result = await conn.query(sql, id);
		conn.end();
		return result.affectedRows;
	},

	async getUsuarioPorCorreo(correo) {
		// Sirve para validar que el email no se repita al crear un nuevo usuario
		conn = await pool.getConnection();
		sql = "SELECT * FROM usuarios WHERE email = ?";
		const rows = await conn.query(sql, correo);
		conn.end();
		return rows[0]; // Devuelve el primer usuario encontrado con el correo especificado
	},
};
