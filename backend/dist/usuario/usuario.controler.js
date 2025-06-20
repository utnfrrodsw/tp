import { Usuario } from './usuario.entity.js';
import { orm } from '../shared/db/orm.js';
const em = orm.em;
function sanitizeUsuarioInput(req, res, next) {
    req.body.sanitizeUsuarioInput = {
        mail: req.body.mail,
        contrasena: req.body.contrasena,
        tipoDoc: req.body.tipoDoc,
        numeroDoc: req.body.numeroDoc,
        telefono: req.body.telefono,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        direccion: req.body.direccion,
        nombreFantasia: req.body.nombreFantasia,
        descripcion: req.body.descripcion,
        foto: req.body.foto,
        turno: req.body.turno,
        tarea: req.body.tarea
    };
    Object.keys(req.body.sanitizeUsuarioInput).forEach((key) => {
        if (req.body.sanitizeUsuarioInput[key] === undefined) {
            delete req.body.sanitizeUsuarioInput[key];
        }
    });
    next();
}
async function findall(req, res) {
    try {
        const users = await em.find(Usuario, {}, { populate: ['turnos', 'servicios'] });
        res.status(200).json({ message: 'found all Usuarios', data: users });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findone(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const user = await em.findOneOrFail(Usuario, { id }, { populate: ['turnos', 'servicios'] });
        res.status(200).json({ message: 'found one usuario', data: user });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function add(req, res) {
    try {
        const newUser = em.create(Usuario, req.body.sanitizeUsuarioInput);
        await em.flush();
        res.status(201).json({ message: 'created new usuario', data: newUser });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const updateUser = await em.findOneOrFail(Usuario, { id });
        em.assign(updateUser, req.body.sanitizeUsuarioInput);
        await em.flush();
        res.status(200).json({ message: 'updated usuario', data: updateUser });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const user = await em.findOneOrFail(Usuario, { id });
        await em.removeAndFlush(user);
        res.status(200).json({ message: 'deleted usuario', data: user });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizeUsuarioInput, findall, findone, add, update, remove };
//# sourceMappingURL=usuario.controler.js.map