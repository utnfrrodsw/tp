import { Partido } from "./partido.entity.js";
import { orm } from "../shared/db/orm.js";
const em = orm.em;
function sanitizarPartidoInput(req, res, next) {
    req.body.sanitizarEq = {
        fecha: req.body.fecha,
        torneo: req.body.torneo,
        equipos: req.body.equipos,
        id: req.body.id
    };
    //Acá irían las validaciones de datos...
    Object.keys(req.body.sanitizarEq).forEach(key => {
        if (req.body.sanitizarEq[key] === undefined) {
            delete req.body.sanitizarEq[key];
        }
    });
    next();
}
async function findAll(req, res) {
    try {
        const partidos = await em.find(Partido, {}, { populate: ['torneo', 'equipos'] });
        res.status(200).json({ message: 'found all partidos', data: partidos });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const partido = await em.findOneOrFail(Partido, { id }, { populate: ['torneo', 'equipos'] });
        res.status(200).json({ message: 'found partido', data: partido });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function add(req, res) {
    try {
        const partido = em.create(Partido, req.body);
        await em.flush();
        res.status(200).json({ message: 'partido created', data: partido });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const partido = em.findOneOrFail(Partido, id);
        em.assign(Partido, req.body);
        await em.flush();
        res.status(200).json({ message: 'partido updated', data: partido });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const partido = em.getReference(Partido, id);
        await em.removeAndFlush(partido);
        res.status(200).json({ message: 'partido removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizarPartidoInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=partido.controler.js.map