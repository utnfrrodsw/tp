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
    res.status(500).json({ message: 'not implemented' });
}
async function add(req, res) {
    res.status(500).json({ message: 'not implemented' });
}
async function update(req, res) {
    res.status(500).json({ message: 'not implemented' });
}
async function remove(req, res) {
    res.status(500).json({ message: 'not implemented' });
}
export { findAll, findOne, add, update, remove, sanitizeZonaInput };
//# sourceMappingURL=zona.controller.js.map