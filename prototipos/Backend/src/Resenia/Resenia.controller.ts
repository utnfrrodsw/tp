import { Request, Response, NextFunction } from "express";
import { ReseniaRepository } from "./Resenia.repository.js";
import { Resenia } from "./Resenia.js";
import { ObjectId } from "mongodb";

const repository = new ReseniaRepository();

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
        const resenia = await repository.findOne({ id });
        if (!resenia) {
            return res.status(404).send({ message: "Reseña no encontrada." });
        }
        return res.json({ data: resenia });
    } catch (error) {
        console.error("Error en findOne:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function add(req: Request, res: Response) {
    try {
        const input = req.body.sanitizedInput;
        const reseniaInput = new Resenia(
            input.comentario,
            input.calificacion,
            new ObjectId(input.usuario),
            new ObjectId(input.libro),

        );

        const resenia = await repository.add(reseniaInput);
        res.status(201).send({ message: 'Reseña agregada con éxito.', data: resenia });
    } catch (error) {
        console.error("Error en add:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function update(req: Request, res: Response) {
    try {
        const reseniaId = req.params.id;
        const updatedData = req.body.sanitizedInput;

        const reseniaExiste = await repository.findOne({ id: reseniaId });

        if (!reseniaExiste) {

            const objectIdReseniaId = new ObjectId(reseniaId);

            const reseniaInput = new Resenia(
                updatedData.comentario,
                updatedData.calificacion,
                updatedData.usuario,
                updatedData.libro,
                objectIdReseniaId
            );
            const nuevoResenia = await repository.add(reseniaInput);

            if (!nuevoResenia) {
                return res.status(500).send({ message: "Error al crear la nueva reseña." });
            }

            return res.status(201).send({ message: 'Reseña creada con éxito.', data: nuevoResenia });
        }

        const updatedResenia = await repository.update(reseniaId, updatedData);

        if (!updatedResenia) {
            return res.status(500).send({ message: "Error al actualizar la Reseña" });
        }

        return res.status(200).send({ message: 'Reseña actualizada con éxito.', data: updatedResenia });

    } catch (error) {
        console.error("Error en update:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const resenia = await repository.delete({ id });
        if (!resenia) {
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
        const resenias = await repository.findByUsuario(usuarioId);

        if (!resenias || resenias.length === 0) {
            return res.status(404).send({ message: "No se encontraron reseñas para el Usuario proporcionado." });
        }

        res.status(200).send({ message: 'Reseñas encontradas con éxito.', data: resenias });
    } catch (error) {
        console.error("Error en findByUsuario:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function findByLibro(req: Request, res: Response) {
    try {
        const libroId = req.params.libroId;
        const resenias = await repository.findByLibro(libroId);

        if (!resenias || resenias.length === 0) {
            return res.status(404).send({ message: "No se encontraron reseñas para el Libro proporcionado." });
        }

        res.status(200).send({ message: 'Reseñas encontradas con éxito.', data: resenias });
    } catch (error) {
        console.error("Error en findByLibro:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function getComentario(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const resenia = await repository.findOne({ id });
        if (!resenia) {
            return res.status(404).send({ message: "Comentario no encontrado." });
        }
        res.json({ data: resenia.comentario });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function getCalificacion(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const resenia = await repository.findOne({ id });
        if (!resenia) {
            return res.status(404).send({ message: "Calificación no encontrado." });
        }
        res.json({ data: resenia.calificacion });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function getResenias(req: Request, res: Response) {
    try {
        const resenias = await repository.findAll();
        const reseniasIds = resenias?.map((resenia) => resenia._id);
        res.json({ data: reseniasIds });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

export { sanitizeInput, findAll, findOne, add, update, remove, findByUsuario, findByLibro, getComentario, getCalificacion, getResenias } 