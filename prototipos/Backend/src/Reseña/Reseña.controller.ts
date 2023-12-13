import { Request, Response, NextFunction } from "express";
import { ReseñaRepository } from "./Reseña.repository.js";
import { Reseña } from "./Reseña.js";
import { ObjectId } from "mongodb";

const repository = new ReseñaRepository();

async function sanitizeInput(req: Request, res: Response, next: NextFunction) {
    try {
        const requiredKeys = ['comentario', 'usuario', 'calificacion'];

        req.body.sanitizedInput = {};

        for (const key of requiredKeys) {
            if (req.body[key] === undefined) {
                return res.status(400).send({ message: `Campo '${key}' es requerido.` });
            }

            req.body.sanitizedInput[key] = req.body[key];
        }

        next();
    } catch (error) {
        console.error("Error en sanitizeInput:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function findAll(req: Request, res: Response) {
    try {
        const data = await repository.findAll();
        res.json({ data });
    } catch (error) {
        console.error("Error en findAll:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const reseña = await repository.findOne({ id });
        if (!reseña) {
            return res.status(404).send({ message: "Reseña no encontrada." });
        }
        return res.json({ data: reseña });
    } catch (error) {
        console.error("Error en findOne:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function add(req: Request, res: Response) {
    try {
        const input = req.body.sanitizedInput;

        const reseñaInput = new Reseña(
            input.comentario,
            input.calificacion,
            new ObjectId(input.usuario),
            new ObjectId(input.libro),
        );

        const reseña = await repository.add(reseñaInput);
        res.status(201).send({ message: 'Reseña agregada con éxito.', data: reseña });
    } catch (error) {
        console.error("Error en add:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function update(req: Request, res: Response) {
    try {
        const reseñaId = req.params.id;
        const updatedData = req.body.sanitizedInput;

        const reseñaExiste = await repository.findOne({ id: reseñaId });

        if (!reseñaExiste) {

            const objectIdReseñaId = new ObjectId(reseñaId);

            const reseñaInput = new Reseña(
                updatedData.comentario,
                updatedData.calificacion,
                updatedData.usuario,
                updatedData.libro,
                objectIdReseñaId
            );
            const nuevoReseña = await repository.add(reseñaInput);

            if (!nuevoReseña) {
                return res.status(500).send({ message: "Error al crear la nueva reseña." });
            }

            return res.status(201).send({ message: 'Reseña creada con éxito.', data: nuevoReseña });
        }

        const updatedReseña = await repository.update(reseñaId, updatedData);

        if (!updatedReseña) {
            return res.status(500).send({ message: "Error al actualizar la Reseña" });
        }

        return res.status(200).send({ message: 'Reseña actualizada con éxito.', data: updatedReseña });

    } catch (error) {
        console.error("Error en update:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const reseña = await repository.delete({ id });
        if (!reseña) {
            res.status(404).send({ message: "Reseña no encontrada." });
        }
        res.status(204).send({ message: 'Reseña eliminada con éxito.' });
    } catch (error) {
        console.error("Error en remove:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function findByUsuario(req: Request, res: Response) {
    try {
        const usuarioId = req.params.usuarioId;
        const reseñas = await repository.findByUsuario(usuarioId);

        if (!reseñas || reseñas.length === 0) {
            return res.status(404).send({ message: "No se encontraron reseñas para el Usuario proporcionado." });
        }

        res.status(200).send({ message: 'Reseñas encontradas con éxito.', data: reseñas });
    } catch (error) {
        console.error("Error en findByUsuario:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}



export { sanitizeInput, findAll, findOne, add, update, remove, findByUsuario }