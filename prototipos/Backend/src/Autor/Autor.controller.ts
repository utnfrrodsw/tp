import { Request, Response, NextFunction } from "express"
import { AutorRepository } from "./Autor.repository.js"
import { Autor } from "./Autor.js"

const repository = new AutorRepository()

async function sanitizeInput(req: Request, res: Response, next: NextFunction) {
    try {
        req.body.sanitizedInput = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            id: req.body.id,
        };

        // Eliminar claves no definidas
        Object.keys(req.body.sanitizedInput).forEach(key => {
            if (req.body.sanitizedInput[key] === undefined) {
                delete req.body.sanitizedInput[key];
            }
        });

        next();
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function findAll(req: Request, res: Response) {
    try {
        const data = await repository.findAll();
        res.json({ data });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const autor = await repository.findOne({ id });
        if (!autor) {
            return res.status(404).send({ message: "Autor no encontrado." });
        }
        return res.json({ data: autor });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function add(req: Request, res: Response) {
    try {
        const input = req.body.sanitizedInput;
        const autorInput = new Autor(input.nombre, input.apellido, input.id);
        const autor = await repository.add(autorInput);
        res.status(201).send({ message: 'Autor agregado con éxito.', data: autor });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function update(req: Request, res: Response) {
    try {
        const autor = await repository.update(req.params.id, req.body.sanitizedInput);
        if (!autor) {
            return res.status(404).send({ message: "Autor no encontrado." });
        }
        return res.status(200).send({ message: 'Autor actualizado con éxito.', data: autor });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const autor = await repository.delete({ id });
        if (!autor) {
            return res.status(404).send({ message: "Autor no encontrado." });
        }
        return res.status(204).send({ message: 'Autor eliminado con éxito.' });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

export { sanitizeInput, findAll, findOne, add, update, remove }