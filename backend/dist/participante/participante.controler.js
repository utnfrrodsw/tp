import { Participante } from "./participante.entity.js";
import { orm } from "../shared/db/orm.js";
const em = orm.em;
function sanitizarParticipanteInput(req, res, next) {
    req.body.sanitizarPar = {
        nombre: req.body.nombre,
        contraseña: req.body.contraseña,
        apellido: req.body.apellido,
        mail: req.body.mail,
        fecha_nacimiento: req.body.fecha_nacimiento,
        tipos_par: req.body.tipos_par,
        equipos: req.body.equipos,
        id: req.body.id
    };
    //Acá irían las validaciones de datos...
    Object.keys(req.body.sanitizarPar).forEach(key => {
        if (req.body.sanitizarPar[key] === undefined) {
            delete req.body.sanitizarPar[key];
        }
    });
    next();
}
async function findAll(req, res) {
    try {
        const participantes = await em.find(Participante, {}, { populate: ['tipos_par', 'equipos'] });
        res.status(200).json({ message: 'found all participantes', data: participantes });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const participante = await em.findOneOrFail(Participante, { id }, { populate: ['tipos_par', 'equipos'] });
        res.status(200).json({ message: 'found participante', data: participante });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function add(req, res) {
    try {
        const participante = em.create(Participante, req.body);
        await em.flush();
        res.status(200).json({ message: 'participante created', data: participante });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const participante = em.findOneOrFail(Participante, id);
        em.assign(Participante, req.body);
        await em.flush();
        res.status(200).json({ message: 'participante updated', data: participante });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const participante = em.getReference(Participante, id);
        await em.removeAndFlush(participante);
        res.status(200).json({ message: 'participante removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizarParticipanteInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=participante.controler.js.map