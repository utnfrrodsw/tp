const { jsonResponse } = require('../lib/jsonResponse');
const db = require('../models');

const direccionesController = {
    getSolicitudCliente: async (req, res) => {
        try{
            const id = req.params.id;
            const direcciones = await db.Direccion.findAll({
                where: { idUsuario: id },
                include: [{association: 'localidad'}]
            });
            res.status(200).json(jsonResponse(200, {
                message: 'Direcciones obtenidas con éxito',
                direcciones: direcciones
            }));
        }catch (error) {
            res.status(500).json(jsonResponse(500, {
                message: 'Direcciones no obtenidas',
                direcciones: []
            }));
        }
    }
};

module.exports = direccionesController;