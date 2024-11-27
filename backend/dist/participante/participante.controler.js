import { Participante } from "./participante.entity.js";
import { orm } from "../shared/db/orm.js";
import bcrypt from 'bcrypt';
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
async function registroParticipante(req, res) {
    const { mail } = req.body;
    const user = await em.findOne(Participante, { mail });
    if (!user) {
        const participante = await em.create(Participante, req.body);
        participante.contraseña = await bcrypt.hash(participante.contraseña, 10);
        await em.flush();
        return res.status(201).json({ message: 'Participante registrado exitosamente' });
    }
    return res.status(500).json({ message: 'Ya existe un participante con ese mail asociado' });
}
async function update(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const participante = await em.findOneOrFail(Participante, id);
        em.assign(participante, req.body);
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
export { sanitizarParticipanteInput, findAll, findOne, registroParticipante, update, remove };
//# sourceMappingURL=participante.controler.js.map