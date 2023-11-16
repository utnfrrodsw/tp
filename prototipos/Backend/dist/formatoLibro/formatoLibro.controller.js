import { formatoLibroRepository } from "./formatoLibro.repository.js";
import { formatoLibro } from "./formatoLibro.js";
import { ObjectId } from "mongodb";
const repository = new formatoLibroRepository();
async function sanitizeInput(req, res, next) {
    try {
        req.body.sanitizedInput = {
            descripcion: req.body.descripcion,
        };
        Object.keys(req.body.sanitizedInput).forEach((key) => {
            if (req.body.sanitizedInput[key] === undefined) {
                delete req.body.sanitizedInput[key];
            }
        });
        next();
    }
    catch (error) {
        console.error("Error en sanitizeInput:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}
async function findAll(req, res) {
    try {
        res.json({ data: await repository.findAll() });
    }
    catch (error) {
        console.error("Error en findAll:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}
async function findOne(req, res) {
    try {
        const id = req.params.id;
        const formato = await repository.findOne({ id });
        if (!formato) {
            return res.status(404).send({ message: "Formato no encontrado" });
        }
        return res.json({ data: formato });
    }
    catch (error) {
        console.error("Error en findOne:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}
async function add(req, res) {
    try {
        const input = req.body.sanitizedInput;
        const formatoInput = new formatoLibro(input.descripcion);
        const formato = await repository.add(formatoInput);
        res.status(201).send({ message: 'Formato agregado con éxito', data: formato });
    }
    catch (error) {
        console.error("Error en add:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}
async function update(req, res) {
    try {
        const formatoId = req.params.id;
        const updatedData = req.body.sanitizedInput;
        // Verificar si el formato existe antes de intentar actualizarlo
        const formatoExiste = await repository.findOne({ id: formatoId });
        if (!formatoExiste) {
            const objectIdFormatoId = new ObjectId(formatoId);
            const formatoInput = new formatoLibro(updatedData.descripcion, objectIdFormatoId);
            const nuevoFormato = await repository.add(formatoInput);
            if (!nuevoFormato) {
                return res.status(500).send({ message: "Error al crear el nuevo formato." });
            }
            return res.status(201).send({ message: 'Formato creado con éxito.', data: nuevoFormato });
        }
        // Si el formato existe, lo actualiza
        const updatedFormato = await repository.update(formatoId, updatedData);
        if (!updatedFormato) {
            return res.status(500).send({ message: "Error al actualizar el formato." });
        }
        return res.status(200).send({ message: 'Formato actualizado con éxito.', data: updatedFormato });
    }
    catch (error) {
        console.error("Error en update:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function remove(req, res) {
    try {
        const id = req.params.id;
        const formato = await repository.delete({ id });
        if (!formato) {
            res.status(404).send({ message: "Formato no encontrado" });
        }
        res.status(204).send({ message: 'Formato eliminado con éxito' });
    }
    catch (error) {
        console.error("Error en remove:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}
export { sanitizeInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=formatoLibro.controller.js.map