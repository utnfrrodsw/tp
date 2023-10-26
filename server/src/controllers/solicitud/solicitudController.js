const db  = require('../../models');
const fs = require('fs');
const path = require('path');
const { jsonResponse } = require("../../lib/jsonResponse");
const {getSolicitudInfo} = require("../../lib/getSolicitudInfo");

const solicitudController = {
    getSolicitud: function (req, res){
        let idSolicitud = req.params.id;
        console.log(idSolicitud);
        try{
            db.Solicitud.findByPk(idSolicitud,{
                include: [{association: 'direccion'}]
            })
            .then(function(solicitud){
                if(!solicitud) {
                    res.status(404).json({ message: 'Solicitud no encontrada' });
                }
                console.log(solicitud);
                res.json(solicitud);
            })
        }catch(error){
            console.error('Error al obtener solicitud', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    },

    getSolicitudesClienteEstado: function (req, res){
        try{
            const id = req.params.id; 
            const estado = req.params.estado; 
            db.Solicitud.findAll({
            where: {
                estado: estado
            },
            include: [{
                association: 'direccion',
                where: {
                    idUsuario: id
                },
                },
                {
                    association: 'fotosSolicitud' // Si necesitas acceder a las fotos de las solicitudes
                },
                {
                    association: 'profesiones' // Si necesitas acceder a las profesiones de las solicitudes
                }
            ]
            }).then( (solicitudesResponse) => {

                const solicitudes = []

                solicitudesResponse.map((solicitud) => {
                
                    const imgs = solicitud.fotosSolicitud.map((foto) => {
                
                        // Guarda la imagen como archivo individual
                        const filePath = path.join(__dirname, '../../../public/images/imagesdb/' + foto.idfoto + '-fastServices.png');
                        fs.writeFileSync(filePath, foto.foto);
                
                        return {
                            id: foto.idfoto,
                            foto: (foto.idfoto + '-fastServices.png'),// Proporciona la ruta al archivo
                        };
                    });
                    solicitudes.push(getSolicitudInfo(solicitud, imgs));
                });
                
                
                res.status(200).json(jsonResponse(200, {
                    message: "Solicitudes encontradas",
                    //images: images,
                    solicitudes: solicitudes
                }))
            })
            .catch((error) => {
            // Maneja cualquier error
                res.status(500).json(jsonResponse(500, {
                    message: "Error al buscar las solicitudes",
                    solicitudes: [],
                }));
                
            });
        }catch(error){
            console.error('Error al obtener solicitudes', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    },

    createSolicitud: async function (req, res){
        try{
            const { titulo, descripcion, idProfesion, idDireccion} = req.body;
            console.log(req.body);
            console.log(req.files);
            const fotosArray = req.files
            await db.sequelize.transaction( async (t) => {
                // Paso 1: Crea una solicitud
                const solicitud = await db.Solicitud.create(
                    {titulo: titulo,
                    descripcion: descripcion,
                    idDireccion: idDireccion,
                    idProfesion: idProfesion,
                    estado: 'activa',
                    fechaHora: Date.now()},
                    {transaction: t}
                );
              
                // Paso 2: Crea múltiples registros de FotoSolicitud relacionados con la solicitud
                const fotosPromises = fotosArray.map(async (fotoData) => {
                    return db.FotoSolicitud.create({ 
                        foto: fs.readFileSync(path.join(__dirname + '../../../../public/images/solicitud/' + fotoData.filename)),
                        nombre: fotoData.originalname,
                        tipo: fotoData.mimetype,
                        idSolicitud: solicitud._previousDataValues.idSolicitud },
                        { transaction: t });
                });
                await Promise.all(fotosPromises);
            });
            res.status(200).json(jsonResponse(200,{ message: 'Solicitud creada' }));
        }catch(error){
            console.error('Error al crear solicitud', error);
            res.status(500).json(jsonResponse(500,{ message: 'Error en el servidor al subir solicitud' }));
        }
    },
    
    CancelarSolicitud: async function (req, res){
        try {
            const idSolicitud = req.params.id;
            console.log(idSolicitud);
            await db.sequelize.transaction(async (t) => {
              // Paso 1: Buscar la solicitud
              const solicitud = await db.Solicitud.findByPk(idSolicitud);
              if (!solicitud) {
                res.status(404).json(jsonResponse(404, { message: 'Solicitud no encontrada' }));
                return; // Debes regresar para evitar ejecutar el código restante en caso de que no se encuentre la solicitud.
              }
          
              // Paso 2: Eliminar la solicitud
              await db.Solicitud.destroy({ where: { idSolicitud: idSolicitud } }, { transaction: t });
            });
          
            res.status(200).json(jsonResponse(200, { message: 'Solicitud cancelada' }));
          } catch (error) {
            console.error('Error al cancelar solicitud', error);
            res.status(500).json(jsonResponse(500, { message: 'Error en el servidor al cancelar solicitud' }));
          }
          
    }
};

module.exports = solicitudController;