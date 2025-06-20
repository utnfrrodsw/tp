import { Zona } from './zona.entity.js';
import { orm } from '../shared/db/orm.js';
const em = orm.em;
function sanitizeZonaInput(req, res, next) {
    req.body.sanitizedInput = {
        descripcionZona: req.body.descripcionZona
    };
    next();
}
async function findAll(req, res) {
    try {
        const zona = await em.find(Zona, {});
        res.status(200).json({ message: 'find all zonas exitoso', data: Zona });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    try {
        //id
        const zona = await em.findOneOrFail(Zona, { /*id*/});
        res
            .status(200)
            .json({ message: "found zon", data: zona });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function add(req, res) {
    try {
        const zona = em.create(Zona, req.body.sanitizedInput);
        await em.flush();
        res.status(201).json({ message: 'zona creada', data: zona });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    // try{
    //     //id
    //     const zona = em.getReference(Zona,/*id*/)
    //     em.assign(zona, req.body.sanitizedInput)
    //     await em.flush()
    //     res
    //         .status(200)
    //         .json({message: "zona actualizada"})
    // }catch(error:any){res.status(500).json({message:error.message})}
}
async function remove(req, res) {
    //  try{
    //     //id
    //     const zona = em.getReference(Zona, /*id*/)
    //     await em.removeAndFlush(zona);
    //     res.status(200).send({message:'zona borrada'})
    // }catch(error:any){res.status(500).json({message:error.message})}
}
export { findAll, findOne, add, update, remove, sanitizeZonaInput };
//# sourceMappingURL=zona.controller.js.map