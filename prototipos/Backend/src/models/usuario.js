const pool = require('../config/database');

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
        sql = `
            INSERT INTO usuarios(nombre, apellido, email, direccion, id_localidad, avatar, tipo)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const result = await conn.query(sql, [
            data.nombre,
            data.apellido,
            data.email,
            data.direccion,
            data.id_localidad,
            data.avatar,
            data.tipo
        ]);
        conn.end();
        return result.insertId;
    },

    async updateUsuario(id, data) {
        conn = await pool.getConnection();
        sql = `
            UPDATE usuarios
            SET nombre = ?, apellido = ?, email = ?, direccion = ?, id_localidad = ?, avatar = ?, tipo = ?
            WHERE id = ?
        `;
        console.log(id, data);
        const result = await conn.query(sql, [
            data.nombre,
            data.apellido,
            data.email,
            data.direccion,
            data.id_localidad,
            data.avatar,
            data.tipo
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
    }

};
