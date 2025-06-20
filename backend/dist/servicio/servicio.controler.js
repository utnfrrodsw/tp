import { Servicio } from './servicio.entity.js';
import { orm } from '../shared/db/orm.js';
const em = orm.em;
function sanitizeServicioInput(req, res, next) {
    req.body.sanitizeServicioInput = {
        precio: req.body.precio,
        tarea: req.body.tarea,
        usuarios: req.body.usuarios,
    };
    Object.keys(req.body.sanitizeServicioInput).forEach((key) => {
        if (req.body.sanitizeServicioInput[key] === undefined) {
            delete req.body.sanitizeServicioInput[key];
        }
    });
    next();
}
// Find all services
async function findall(req, res) {
    try {
        const services = await em.find(Servicio, {}, { populate: ['usuarios', 'tarea'] });
        res.status(200).json({ message: 'found all services', data: services });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//# sourceMappingURL=servicio.controler.js.map