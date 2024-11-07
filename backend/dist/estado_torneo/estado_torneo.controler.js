import { Estado_torneo } from './estado_torneo.entity.js';
import { orm } from '../shared/db/orm.js';
const em = orm.em;
function sanitizedEstadoInput(req, res, next) {
    req.body.sanitizedInput = {
        id: req.body.id,
        nombre_estado: req.body.nombre_estado,
        torneos: req.body.torneos
    };
    //Acá irían las validaciones de datos...
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
async function findAll(req, res) {
    try {
        const estados_torneo = await em.find(Estado_torneo, {}, { populate: ['torneos'] });
        res.status(200).json({ message: 'found all estados_torneo', data: estados_torneo });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const estado_torneo = await em.findOneOrFail(Estado_torneo, { id }, { populate: ['torneos'] });
        res.status(200).json({ message: 'found estado_torneo', data: estado_torneo });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function add(req, res) {
    try {
        const estado_torneo = em.create(Estado_torneo, req.body);
        await em.flush();
        res.status(200).json({ message: 'estado_torneo created', data: estado_torneo });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const estado_torneo = em.findOneOrFail(Estado_torneo, id);
        em.assign(Estado_torneo, req.body);
        await em.flush();
        res.status(200).json({ message: 'estado_torneo updated', data: estado_torneo });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const estado_torneo = em.getReference(Estado_torneo, id);
        await em.removeAndFlush(estado_torneo);
        res.status(200).json({ message: 'estado_torneo removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizedEstadoInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=estado_torneo.controler.js.map