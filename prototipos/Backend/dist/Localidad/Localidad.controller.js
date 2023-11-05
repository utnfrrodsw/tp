import { LocalidadRepository } from "./Localidad.repository.js";
import { Localidad } from "./Localidad.entity.js";
const repository = new LocalidadRepository();
async function sanitizeInput(req, res, next) {
    try {
        req.body.sanitizedInput = {
            cod_postal: req.body.cod_postal,
            descripcion: req.body.descripcion,
            provincia: req.body.provincia,
        };
        // Eliminar claves no definidas
        Object.keys(req.body.sanitizedInput).forEach((key) => {
            if (req.body.sanitizedInput[key] === undefined) {
                delete req.body.sanitizedInput[key];
            }
        });
        next();
    }
    catch (error) {
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
}
async function findAll(req, res) {
    try {
        const localidades = await repository.findAll();
        res.json({ data: localidades });
    }
    catch (error) {
        console.error("Error en findAll:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function findOne(req, res) {
    try {
        const id = req.params.id;
        const localidad = await repository.findOne({ id });
        if (!localidad) {
            return res.status(404).send({ message: "No se encontró la localidad." });
        }
        res.json({ data: localidad });
    }
    catch (error) {
        console.error("Error en findOne:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function add(req, res) {
    try {
        const input = req.body.sanitizedInput;
        const localidadInput = new Localidad(input.cod_postal, input.descripcion, input.provincia);
        const localidad = await repository.add(localidadInput);
        res.status(201).send({ message: 'Localidad agregada exitosamente.', data: localidad });
    }
    catch (error) {
        console.error("Error en add:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function update(req, res) {
    try {
        const localidad = await repository.update(req.params.id, req.body.sanitizedInput);
        if (!localidad) {
            return res.status(404).send({ message: "No se encontró la localidad." });
        }
        res.status(200).send({ message: 'Localidad actualizada exitosamente.', data: localidad });
    }
    catch (error) {
        console.error("Error en update:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function remove(req, res) {
    try {
        const id = req.params.id;
        const localidad = await repository.delete({ id });
        if (!localidad) {
            return res.status(404).send({ message: "No se encontró la localidad." });
        }
        res.status(204).send({ message: 'Localidad eliminada exitosamente.' });
    }
    catch (error) {
        console.error("Error en remove:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
export { sanitizeInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=Localidad.controller.js.map