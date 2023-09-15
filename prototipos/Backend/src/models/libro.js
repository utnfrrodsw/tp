const pool = require('../config/database');

module.exports = {

    async getLibros() {
        conn = await pool.getConnection();
        sql = "SELECT * FROM libros";
        const rows = await conn.query(sql);
        conn.end();
        console.log(rows);
        return rows;
    },

    async getLibroById(id) {
        conn = await pool.getConnection();
        sql = "SELECT * FROM libros WHERE id = ?";
        const rows = await conn.query(sql, id);
        conn.end();
        return rows[0];
    },

    async createLibro(data) {
        conn = await pool.getConnection();
        sql = `
            INSERT INTO libros(isbn, titulo, id_editorial, idioma, descripcion, precio, fecha)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await conn.query(sql, [
            data.isbn,
            data.titulo,
            data.id_editorial,
            data.idioma,
            data.descripcion,
            data.precio,
            data.fecha
        ]);
        conn.end();
        return result.insertId;
    },

    async updateLibro(id, data) {
        conn = await pool.getConnection();
        sql = `
            UPDATE libros
            SET isbn = ?, titulo = ?, id_editorial = ?, idioma = ?, descripcion = ?, precio = ?, fecha = ?
            WHERE id = ?
        `;
        console.log(id, data);
        const result = await conn.query(sql, [
            data.isbn,
            data.titulo,
            data.id_editorial,
            data.idioma,
            data.descripcion,
            data.precio,
            data.fecha,
            data.id
        ]);
        conn.end();
        return result.affectedRows;
    },

    async deleteLibro(id) {
        conn = await pool.getConnection();
        sql = "DELETE FROM libros WHERE id = ?";
        const result = await conn.query(sql, id);
        conn.end();
        return result.affectedRows;
    }

};
