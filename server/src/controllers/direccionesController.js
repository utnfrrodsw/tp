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
    },

    agregarDireccion: async (req, res) => {
        try{
            const idUsuario = req.params.id;
            const { calle, numero, piso, departamento, codigoPostal, ciudad, provincia } = req.body;
            await db.sequelize.transaction( async (t) => {
                const localidad = await db.Localidad.findOne({
                    where: { codPostal: codigoPostal }
                }, { transaction: t })
                if(!localidad){
                    await db.Localidad.create({
                        codPostal: codigoPostal,
                        nombre: ciudad,
                        provincia: provincia,
                    }, { transaction: t });
                }

                const direccion = await db.Direccion.findOne({
                    where: { calle: calle, numero: numero, piso: piso, dpto: departamento, idUsuario: idUsuario },
                }, { transaction: t})

                console.log(direccion);

                if (!direccion) {
                    await db.Direccion.create(
                        {
                            calle: calle,
                            numero: numero,
                            piso: piso,
                            dpto: departamento,
                            idUsuario: idUsuario,
                            codPostal: codigoPostal,
                        },
                        { transaction: t }
                    );
                } else {
                    throw new Error('Direccion ya existente');
                }

            });
            console.log('Direccion agregada con éxito')
            res.status(200).json(jsonResponse(200, {
                message: 'Direccion agregada con éxito'
            }));
        }catch (error) {
            res.status(500).json(jsonResponse(500, {
                message: 'Direccion no agregada',
            }));
        }
    },
};

module.exports = direccionesController;