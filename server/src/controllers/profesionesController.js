const { jsonResponse } = require('../lib/jsonResponse');
const db = require('../models');

const profesionesController = {
    getProfesionesExistentes: async (req, res) => {
        const profesiones = await db.Profesion.findAll();
        res.status(200).json(jsonResponse(200, {
            message: 'Profesiones obtenidas con éxito',
            profesiones: profesiones
        }));
    },
};

module.exports = profesionesController;