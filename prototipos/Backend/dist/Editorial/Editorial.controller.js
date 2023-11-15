import { EditorialRepository } from "./Editorial.repository.js";
import { Editorial } from "./Editorial.js";
import { ObjectId } from "mongodb";
const repository = new EditorialRepository();
async function sanitizeInput(req, res, next) {
    try {
        req.body.sanitizedInput = {
            descripcion: req.body.descripcion,
            direccion: req.body.direccion,
            imagen: req.body.imagen,
            id: req.body.id instanceof ObjectId ? req.body.id.toString() : req.body.id
        };
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
        const editorials = await repository.findAll();
        res.json({ data: editorials });
    }
    catch (error) {
        console.error("Error en findAll:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}
async function findOne(req, res) {
    try {
        const id = req.params.id;
        const editorial = await repository.findOne({ id });
        if (!editorial) {
            return res.status(404).send({ message: "No se encontró la editorial" });
        }
        res.json({ data: editorial });
    }
    catch (error) {
        console.error("Error en findOne:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}
async function add(req, res) {
    try {
        const input = req.body.sanitizedInput;
        const editorialInput = new Editorial(input.descripcion, input.direccion, input.imagen);
        const editorial = await repository.add(editorialInput);
        res.status(201).send({ message: 'Editorial agregada exitosamente', data: editorial });
    }
    catch (error) {
        console.error("Error en add:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}
async function update(req, res) {
    try {
        const editorial = await repository.update(req.params.id, req.body.sanitizedInput);
        if (!editorial) {
            return res.status(404).send({ message: "No se encontró la editorial" });
        }
        res.status(200).send({ message: 'Editorial actualizada exitosamente', data: editorial });
    }
    catch (error) {
        console.error("Error en update:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}
async function remove(req, res) {
    try {
        const id = req.params.id;
        const editorial = await repository.delete({ id });
        if (!editorial) {
            return res.status(404).send({ message: "No se encontró la editorial" });
        }
        res.status(204).send({ message: 'Editorial eliminada exitosamente' });
    }
    catch (error) {
        console.error("Error en remove:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}
async function getEditoriales(req, res) {
    try {
        const editoriales = await repository.findAll();
        const editorialIds = editoriales?.map((editorial) => editorial._id);
        res.json({ data: editorialIds });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function getDescripcion(req, res) {
    try {
        const id = req.params.id;
        const editorial = await repository.findOne({ id });
        if (!editorial) {
            return res.status(404).send({ message: "Editorial no encontrada." });
        }
        res.json(editorial.descripcion); // Devolver directamente la descripción
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function getImagen(req, res) {
    try {
        const id = req.params.id;
        const editorial = await repository.findOne({ id });
        if (!editorial) {
            return res.status(404).send({ message: "Editorial no encontrada." });
        }
        res.json({ data: editorial.imagen });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
export { sanitizeInput, findAll, findOne, add, update, remove, getEditoriales, getDescripcion, getImagen };
//# sourceMappingURL=Editorial.controller.js.map