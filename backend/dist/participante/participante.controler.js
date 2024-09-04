import { ParticipantesRepository } from "./participante.repository.js";
import { Participante } from "./participante.entity.js";
const repository = new ParticipantesRepository();
function sanitizarParticipanteInput(req, res, next) {
    req.body.sanitizarPar = {
        nombre: req.body.nombre,
        contraseña: req.body.contraseña,
        apellido: req.body.apellido,
        mail: req.body.mail,
        fecha_nacimiento: req.body.fecha_nacimiento,
        tipo_par: req.body.tipo_par,
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
    return res.json({ data: await repository.findAll() });
}
async function findOne(req, res) {
    const id = req.params.id;
    const participante = await repository.findOne({ id });
    if (!participante) {
        return res.status(404).send({ message: 'ID incorrecto, no existe ninguna participante con el ID indicado' });
    }
    else {
        return res.json({ data: participante });
    }
}
async function add(req, res) {
    const input = req.body.sanitizarPar;
    const participanteInput = new Participante(input.nombre, input.contraseña, input.apellido, input.mail, input.fecha_nacimiento, input.tipo_par, input.id);
    const participante = await repository.add(participanteInput);
    return res.status(201).send({ message: 'Participante caragado correctamente', data: participante });
}
async function update(req, res) {
    req.body.sanitizarPar.id = req.params.id;
    const participante = await repository.update(req.params.id, req.body.sanitizarPar);
    if (!participante) {
        return res.status(404).send({ message: 'ID incorrecto, no existe ningún participante con el ID indicado' });
    }
    else {
        return res.status(200).send({ message: 'Participante modificado correctamente', data: participante });
    }
}
async function remove(req, res) {
    const id = req.params.id;
    const participante = await repository.delete({ id });
    if (!participante) {
        return res.status(404).send({ message: 'ID incorrecto, no existe ningún participante con el ID indicado' });
    }
    else {
        return res.status(200).send({ message: 'Participante borrado correctamente' });
    }
}
export { sanitizarParticipanteInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=participante.controler.js.map