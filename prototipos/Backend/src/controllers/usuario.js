const um = require('../models/usuario');


module.exports = {

    async getUsuarios(req, res) {
        try {
            const usuarios = await um.getUsuarios();
            if (!usuarios){
                res.status(404).json({ success: false, msg: "No existen usuarios" });
                return;
            }
            res.json({ success: true, data: usuarios });
        } catch(error) {
            res.status(500).json({ success: false, msg: "Error al obtener los usuarios" });
        }
    },

    async getUsuario(req, res) {
        const id = parseInt(req.params.id);
        try {
            const usuario = await um.getUsuarioById(id);
            if (!usuario) {
                res.status(404).json({ success: false, msg: "No existe el usuario" });
                return;
            }
            res.json({ success: true, data: usuario });
        } catch(error) {
            res.status(500).json({ success: false, msg: "Error al obtener el usuario" });
        }
    },

    async createUsuario(req, res) {
        const data = req.body;
        try {
            const id = await um.createUsuario(data);
            res.json({ success: true, msg: `Usuario ${id} creado` });
        } catch(error) {
            res.status(500).json({ success: false, msg: "Error al crear el usuario" });
        }
    },

    async updateUsuario(req, res) {
        const id = parseInt(req.params.id);
        const data = req.body;
        try {
            const affectedRows = await um.updateUsuario(id, data);
            if (!affectedRows){
                res.status(404).json({ success: false, msg: "No existe el usuario indicado" });
                return;
            }
            res.json({ success: true, msg: "Usuario actualizado" });
        } catch(error) {
            res.status(500).json({ success: false, msg: "Error al actualizar el usuario" });
        }
    },

    async deleteUsuario(req, res) {
        const id = req.params.id;
        try {
            const affectedRows = await um.deleteUsuario(id);
            if (!affectedRows){
                res.status(404).json({ success: false, msg: "No existe el usuario indicado" });
                return;
            }
            res.json({ success: true, msg: "Usuario borrado" });
        } catch(error) {
            res.status(500).json({ success: false, msg: "Error al borrar el usuario" });
        }
    }

};
