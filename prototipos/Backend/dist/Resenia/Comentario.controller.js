import { ReseniaRepository } from "./Resenia.repository.js";
import { Resenia } from "./Resenia.js";
import { ObjectId } from "mongodb";
const repository = new ReseniaRepository();
async function sanitizeInput(req, res, next) {
    try {
        const requiredKeys = ['comentario', 'usuario'];
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
        const comentario = await repository.findOne({ id });
        if (!comentario) {
            return res.status(404).send({ message: "Reseña no encontrado." });
        }
        return res.json({ data: comentario });
    }
    catch (error) {
        console.error("Error en findOne:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function add(req, res) {
    try {
        const input = req.body.sanitizedInput;
        const comentarioInput = new Resenia(input.comentario, new ObjectId(input.usuario));
        const comentario = await repository.add(comentarioInput);
        res.status(201).send({ message: 'Reseña agregado con éxito.', data: comentario });
    }
    catch (error) {
        console.error("Error en add:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function update(req, res) {
    try {
        const comentarioId = req.params.id;
        const updatedData = req.body.sanitizedInput;
        const comentarioExiste = await repository.findOne({ id: comentarioId });
        if (!comentarioExiste) {
            const objectIdReseniaId = new ObjectId(comentarioId);
            const comentarioInput = new Resenia(updatedData.comentario, updatedData.usuario, objectIdReseniaId);
            const nuevoResenia = await repository.add(comentarioInput);
            if (!nuevoResenia) {
                return res.status(500).send({ message: "Error al crear el nuevo comentario." });
            }
            return res.status(201).send({ message: 'Reseña creado con éxito.', data: nuevoResenia });
        }
        const updatedResenia = await repository.update(comentarioId, updatedData);
        if (!updatedResenia) {
            return res.status(500).send({ message: "Error al actualizar el Reseña" });
        }
        return res.status(200).send({ message: 'Reseña actualizado con éxito.', data: updatedResenia });
    }
    catch (error) {
        console.error("Error en update:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function remove(req, res) {
    try {
        const id = req.params.id;
        const comentario = await repository.delete({ id });
        if (!comentario) {
            res.status(404).send({ message: "Reseña no encontrado." });
        }
        res.status(204).send({ message: 'Reseña eliminado con éxito.' });
    }
    catch (error) {
        console.error("Error en remove:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function findByUsuario(req, res) {
    try {
        const usuarioId = req.params.usuarioId;
        const comentarios = await repository.findByUsuario(usuarioId);
        if (!comentarios || comentarios.length === 0) {
            return res.status(404).send({ message: "No se encontraron comentarios para el Usuario proporcionado." });
        }
        res.status(200).send({ message: 'Reseñas encontrados con éxito.', data: comentarios });
    }
    catch (error) {
        console.error("Error en findByUsuario:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
export { sanitizeInput, findAll, findOne, add, update, remove, findByUsuario };
//# sourceMappingURL=Comentario.controller.js.map