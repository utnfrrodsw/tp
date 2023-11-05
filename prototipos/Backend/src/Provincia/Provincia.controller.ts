import { Request, Response, NextFunction } from 'express';
import { ProvinciaRepository } from './Provincia.repository.js';
import { Provincia } from './Provincia.entity.js';

const repository = new ProvinciaRepository();

async function sanitizeInput(req: Request, res: Response, next: NextFunction) {
    try {
        req.body.sanitizedInput = {
            id: req.body.id,
            descripcion: req.body.descripcion,
        };

        // Eliminar claves no definidas
        Object.keys(req.body.sanitizedInput).forEach(key => {
            if (req.body.sanitizedInput[key] === undefined) {
                delete req.body.sanitizedInput[key];
            }
        });

        next();
    } catch (error) {
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
}

async function findAll(req: Request, res: Response) {
    try {
        const provincias = await repository.findAll();
        res.json({ data: provincias });
    } catch (error) {
        console.error('Error en findAll:', error);
        res.status(500).send({ message: 'Error interno del servidor' });
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const provincia = await repository.findOne({ id });
        if (!provincia) {
            return res.status(404).send({ message: 'No se encontró la provincia.' });
        }
        res.json({ data: provincia });
    } catch (error) {
        console.error('Error en findOne:', error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
}

async function add(req: Request, res: Response) {
    try {
        const input = req.body.sanitizedInput;
        const provinciaInput = new Provincia(input.id, input.descripcion);
        const provincia = await repository.add(provinciaInput);
        res.status(201).send({ message: 'Provincia agregada exitosamente.', data: provincia });
    } catch (error) {
        console.error('Error en add:', error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
}

async function update(req: Request, res: Response) {
    try {
        const provincia = await repository.update(req.params.id, req.body.sanitizedInput);
        if (!provincia) {
            return res.status(404).send({ message: 'No se encontró la provincia' });
        }
        res.status(200).send({ message: 'Provincia actualizada exitosamente', data: provincia });
    } catch (error) {
        console.error('Error en update:', error);
        res.status(500).send({ message: 'Error interno del servidor' });
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const provincia = await repository.delete({ id });
        if (!provincia) {
            return res.status(404).send({ message: 'No se encontró la provincia.' });
        }
        res.status(204).send({ message: 'Provincia eliminada exitosamente.' });
    } catch (error) {
        console.error('Error en remove:', error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
}

export { sanitizeInput, findAll, findOne, add, update, remove };
