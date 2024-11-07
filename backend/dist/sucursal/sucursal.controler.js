import { Sucursal } from "./sucursal.entity.js";
import { orm } from "../shared/db/orm.js";
const em = orm.em;
function sanitizarSucursalInput(req, res, next) {
    req.body.sanitizarSuc = {
        nombre_sucursal: req.body.nombre_sucursal,
        localidad: req.body.localidad,
        torneos: req.body.torneos,
        id: req.body.id
    };
    //Acá irían las validaciones de datos...
    Object.keys(req.body.sanitizarSuc).forEach(key => {
        if (req.body.sanitizarSuc[key] === undefined) {
            delete req.body.sanitizarSuc[key];
        }
    });
    next();
}
async function findAll(req, res) {
    try {
        const sucursales = await em.find(Sucursal, {}, { populate: ['localidad', 'torneos'] });
        res.status(200).json({ message: 'found all sucursales', data: sucursales });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const sucursal = await em.findOneOrFail(Sucursal, { id }, { populate: ['localidad', 'torneos'] });
        res.status(200).json({ message: 'found sucursal', data: sucursal });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function add(req, res) {
    try {
        const sucursal = em.create(Sucursal, req.body);
        await em.flush();
        res.status(200).json({ message: 'sucursal created', data: sucursal });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const sucursal = em.findOneOrFail(Sucursal, id);
        em.assign(Sucursal, req.body);
        await em.flush();
        res.status(200).json({ message: 'sucursal updated', data: sucursal });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const sucursal = em.getReference(Sucursal, id);
        await em.removeAndFlush(sucursal);
        res.status(200).json({ message: 'sucursal removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizarSucursalInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=sucursal.controler.js.map