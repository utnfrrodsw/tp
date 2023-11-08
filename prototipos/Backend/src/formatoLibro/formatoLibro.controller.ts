import { Request, Response, NextFunction } from "express"
import { formatoLibroRepository } from "./formatoLibro.repository.js"
import { formatoLibro } from "./formatoLibro.js"

const repository = new formatoLibroRepository()

async function sanitizeInput(req: Request, res: Response, next: NextFunction) {
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
    } catch (error) {
        console.error("Error en sanitizeInput:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}

async function findAll(req: Request, res: Response) {
    try {
        res.json({ data: await repository.findAll() });
    } catch (error) {
        console.error("Error en findAll:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const formato = await repository.findOne({ id });
        if (!formato) {
            return res.status(404).send({ message: "Formato no encontrado" });
        }
        return res.json({ data: formato });
    } catch (error) {
        console.error("Error en findOne:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}

async function add(req: Request, res: Response) {
    try {
        const input = req.body.sanitizedInput;
        const formatoInput = new formatoLibro(input.descripcion);
        const formato = await repository.add(formatoInput);
        res.status(201).send({ message: 'Formato agregado con éxito', data: formato });
    } catch (error) {
        console.error("Error en add:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}

async function update(req: Request, res: Response) {
    try {
        const formato = await repository.update(req.params.id, req.body.sanitizedInput);
        if (!formato) {
            return res.status(404).send({ message: "Formato no encontrado" });
        }
        return res.status(200).send({ message: 'Formato actualizado con éxito', data: formato });
    } catch (error) {
        console.error("Error en update:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const formato = await repository.delete({ id });
        if (!formato) {
            res.status(404).send({ message: "Formato no encontrado" });
        }
        res.status(204).send({ message: 'Formato eliminado con éxito' });
    } catch (error) {
        console.error("Error en remove:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}

export { sanitizeInput, findAll, findOne, add, update, remove }