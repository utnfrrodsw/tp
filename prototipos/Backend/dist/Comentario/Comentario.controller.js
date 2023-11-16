import { ComentarioRepository } from "./Comentario.repository.js";
import { Comentario } from "./Comentario.js";
import { ObjectId } from "mongodb";
const repository = new ComentarioRepository();
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
            return res.status(404).send({ message: "Comentario no encontrado." });
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
        const comentarioInput = new Comentario(input.id, input.comentario, new ObjectId(input.usuario));
        const comentario = await repository.add(comentarioInput);
        res.status(201).send({ message: 'Comentario agregado con éxito.', data: comentario });
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
            const objectIdComentarioId = new ObjectId(comentarioId);
            const comentarioInput = new Comentario(updatedData.comentario, updatedData.usuario, objectIdComentarioId);
            const nuevoComentario = await repository.add(comentarioInput);
            if (!nuevoComentario) {
                return res.status(500).send({ message: "Error al crear el nuevo comentario." });
            }
            return res.status(201).send({ message: 'Comentario creado con éxito.', data: nuevoComentario });
        }
        const updatedComentario = await repository.update(comentarioId, updatedData);
        if (!updatedComentario) {
            return res.status(500).send({ message: "Error al actualizar el Comentario" });
        }
        return res.status(200).send({ message: 'Comentario actualizado con éxito.', data: updatedComentario });
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
            res.status(404).send({ message: "Comentario no encontrado." });
        }
        res.status(204).send({ message: 'Comentario eliminado con éxito.' });
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
        res.status(200).send({ message: 'Comentarios encontrados con éxito.', data: comentarios });
    }
    catch (error) {
        console.error("Error en findByUsuario:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
export { sanitizeInput, findAll, findOne, add, update, remove, findByUsuario };
//# sourceMappingURL=Comentario.controller.js.map