import { ProvinciaRepository } from './Provincia.repository.js';
import { Provincia } from './Provincia.entity.js';
import { ObjectId } from 'mongodb';
const repository = new ProvinciaRepository();
async function sanitizeInput(req, res, next) {
    try {
        const requiredKeys = ['descripcion'];
        req.body.sanitizedInput = {};
        for (const key of requiredKeys) {
            if (req.body[key] === undefined) {
                return res.status(400).send({ message: `Campo '${key}' es requerido.` });
            }
            req.body.sanitizedInput[key] = req.body[key];
        }
        next();
    }
    catch (error) {
        console.error("Error en sanitizeInput:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function findAll(req, res) {
    try {
        const data = await repository.findAll();
        res.json({ data });
    }
    catch (error) {
        console.error("Error en findAll:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function findOne(req, res) {
    try {
        const id = req.params.id;
        const provincia = await repository.findOne({ id });
        if (!provincia) {
            return res.status(404).send({ message: "Provincia no encontrada." });
        }
        return res.json({ data: provincia });
    }
    catch (error) {
        console.error("Error en findOne:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function add(req, res) {
    try {
        const input = req.body.sanitizedInput;
        // Verificar si ya existe una provincia con la misma descripción
        const provinciaExistente = await repository.findOneByDescripcion(input.descripcion);
        if (provinciaExistente) {
            return res.status(400).send({ message: "Ya existe una provincia con esta descripción." });
        }
        // Si no existe, proceder a crear la nueva provincia
        const nuevaProvincia = await repository.add(input);
        res.status(201).send({ message: 'Provincia agregada con éxito.', data: nuevaProvincia });
    }
    catch (error) {
        console.error("Error en add:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function update(req, res) {
    try {
        const provinciaId = req.params.id;
        const updatedData = req.body.sanitizedInput;
        // Verificar si la provincia existe antes de intentar actualizarla
        const provinciaExiste = await repository.findOne({ id: provinciaId });
        if (!provinciaExiste) {
            const objectIdProvinciaId = new ObjectId(provinciaId);
            const provinciaInput = new Provincia(updatedData.descripcion, objectIdProvinciaId);
            const nuevoProvincia = await repository.add(provinciaInput);
            if (!nuevoProvincia) {
                return res.status(500).send({ message: "Error al crear la nueva provincia." });
            }
            return res.status(201).send({ message: 'Provincia creada con éxito.', data: nuevoProvincia });
        }
        // Si la provincia existe, la actualiza
        const updatedProvincia = await repository.update(provinciaId, updatedData);
        if (!updatedProvincia) {
            return res.status(500).send({ message: "Error al actualizar la provincia." });
        }
        return res.status(200).send({ message: 'Provincia actualizada con éxito.', data: updatedProvincia });
    }
    catch (error) {
        console.error("Error en update:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function remove(req, res) {
    try {
        const id = req.params.id;
        const provincia = await repository.delete({ id });
        if (!provincia) {
            res.status(404).send({ message: "Provincia no encontrada." });
        }
        res.status(204).send({ message: 'Provincia eliminada con éxito.' });
    }
    catch (error) {
        console.error("Error en remove:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
// OTROS MÉTODOS
async function getProvincias(req, res) {
    try {
        const provincia = await repository.findAll();
        if (provincia) {
            const descripciones = provincia.map((provincia) => provincia.descripcion);
            res.json(descripciones);
        }
        else {
            res.status(404).send({ message: "No se encontraron provincias" });
        }
    }
    catch (error) {
        console.error("Error en obtener las descripciones de las provincias:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}
async function getProvinciaByDescripcion(req, res) {
    try {
        const descripcion = req.params.descripcion;
        const provincia = await repository.findOneByDescripcion(descripcion);
        if (!provincia) {
            return res.status(404).send({ message: "Provincia no encontrada." });
        }
        return res.json({ data: provincia });
    }
    catch (error) {
        console.error("Error en getProvinciaByDescripcion:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
export { sanitizeInput, findAll, findOne, add, update, remove, getProvincias, getProvinciaByDescripcion };
//# sourceMappingURL=Provincia.controller.js.map