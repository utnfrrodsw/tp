const lm = require('../models/libro');


module.exports = {

    async getLibros(req, res) {
        try {
            const libros = await lm.getLibros();
            if (!libros){
                res.status(404).json({ success: false, msg: "No existen libros" });
                return;
            }
            res.json({ success: true, data: libros });
        } catch(error) {
            res.status(500).json({ success: false, msg: "Error al obtener los libros" });
        }
    },

    async getLibro(req, res) {
        const id = parseInt(req.params.id);
        try {
            const libro = await lm.getLibroById(id);
            if (!libro) {
                res.status(404).json({ success: false, msg: "No existe el libro" });
                return;
            }
            res.json({ success: true, data: libro });
        } catch(error) {
            res.status(500).json({ success: false, msg: "Error al obtener el libro" });
        }
    },

    async createLibro(req, res) {
        const data = req.body;
        try {
            const id = await lm.createLibro(data);
            res.json({ success: true, msg: `Libro ${id} creado` });
        } catch(error) {
            res.status(500).json({ success: false, msg: "Error al crear el libro" });
        }
    },

    async updateLibro(req, res) {
        const id = parseInt(req.params.id);
        const data = req.body;
        try {
            const affectedRows = await lm.updateLibro(id, data);
            if (!affectedRows){
                res.status(404).json({ success: false, msg: "No existe el libro indicado" });
                return;
            }
            res.json({ success: true, msg: "Libro actualizado" });
        } catch(error) {
            res.status(500).json({ success: false, msg: "Error al actualizar el libro" });
        }
    },

    async deleteLibro(req, res) {
        const id = req.params.id;
        try {
            const affectedRows = await lm.deleteLibro(id);
            if (!affectedRows){
                res.status(404).json({ success: false, msg: "No existe el libro indicado" });
                return;
            }
            res.json({ success: true, msg: "Libro borrado" });
        } catch(error) {
            res.status(500).json({ success: false, msg: "Error al borrar el libro" });
        }
    }

};
