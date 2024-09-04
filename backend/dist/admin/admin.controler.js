import { AdminsRepository } from "./admin.repository.js";
import { Admin } from "./admin.entity.js";
const repository = new AdminsRepository();
function sanitizarAdminInput(req, res, next) {
    req.body.sanitizarAdm = {
        nombre: req.body.nombre,
        contraseña: req.body.contraseña,
        apellido: req.body.apellido,
        mail: req.body.mail,
        fecha_nacimiento: req.body.fecha_nacimiento,
        id: req.body.id
    };
    //Acá irían las validaciones de datos...
    Object.keys(req.body.sanitizarAdm).forEach(key => {
        if (req.body.sanitizarAdm[key] === undefined) {
            delete req.body.sanitizarAdm[key];
        }
    });
    next();
}
async function findAll(req, res) {
    return res.json({ data: await repository.findAll() });
}
async function findOne(req, res) {
    const id = req.params.id;
    const admin = await repository.findOne({ id });
    if (!admin) {
        return res.status(404).send({ message: 'ID incorrecto, no existe ninguna admin con el ID indicado' });
    }
    else {
        return res.json({ data: admin });
    }
}
async function add(req, res) {
    const input = req.body.sanitizarAdm;
    const adminInput = new Admin(input.nombre, input.contraseña, input.apellido, input.mail, input.fecha_nacimiento, input.id);
    const admin = await repository.add(adminInput);
    return res.status(201).send({ message: 'Admin caragado correctamente', data: admin });
}
async function update(req, res) {
    req.body.sanitizarAdm.id = req.params.id;
    const admin = await repository.update(req.params.id, req.body.sanitizarAdm);
    if (!admin) {
        return res.status(404).send({ message: 'ID incorrecto, no existe ningún admin con el ID indicado' });
    }
    else {
        return res.status(200).send({ message: 'Admin modificado correctamente', data: admin });
    }
}
async function remove(req, res) {
    const id = req.params.id;
    const admin = await repository.delete({ id });
    if (!admin) {
        return res.status(404).send({ message: 'ID incorrecto, no existe ningún admin con el ID indicado' });
    }
    else {
        return res.status(200).send({ message: 'Admin borrado correctamente' });
    }
}
export { sanitizarAdminInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=admin.controler.js.map