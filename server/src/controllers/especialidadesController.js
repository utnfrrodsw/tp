
const db = require('../models');
const { jsonResponse } = require('../lib/jsonResponse');


const especialidadesController = {
    addEspecialidad: async (req, res) => {
        const idUsuario = req.params.idUsuario;
        const { especialidad } = req.body;
        try{
            db.sequelize.transaction(async (t) => {
                const especialidad = await db.especialidad.getOne(
                    {
                        where: {
                            especialidad: especialidad,
                        }
                    }
                , {transaction: t});
                if(especialidad){
                    t.rollback();
                }else{
                    await db.especialidad.create({especialidad}, {transaction: t})
                }
            });
        }catch{

        }
    },
};

module.exports = especialidadesController;