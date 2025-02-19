import { Request, Response, NextFunction } from "express";
import { PedidoRepository } from "./Pedido.repository.js";
import { Pedido } from "./Pedido.js";
import { ObjectId } from "mongodb";

const repository = new PedidoRepository();

async function sanitizeInput(req: Request, res: Response, next: NextFunction) {
    try {
        const requiredKeys = ['fecha', 'usuario', 'libro'];

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
        const pedido = await repository.findOne({ id });
        if (!pedido) {
            return res.status(404).send({ message: "Reseña no encontrada." });
        }
        return res.json({ data: pedido });
    } catch (error) {
        console.error("Error en findOne:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function add(req: Request, res: Response) {
    try {
        const input = req.body.sanitizedInput;

        if (!Array.isArray(input.libro)) {
            return res.status(400).send({ message: "El campo 'libro' debe ser un array." });
        }

        const usuarioId = new ObjectId(input.usuario);

        const libroIds = input.libro.map((libroId: string) => {
            try {
                return new ObjectId(libroId);
            } catch (error) {
                throw new Error(`ID de libro no válido: ${libroId}`);
            }
        });

        const pedidoInput = new Pedido(
            input.fecha,
            usuarioId,
            libroIds
        );

        const pedido = await repository.add(pedidoInput);
        res.status(201).send({ message: 'Pedido agregado con éxito.', data: pedido });
    } catch (error) {
        console.error("Error en add:", error);
        res.status(400).send({message: 'Error'});
    }
}

async function update(req: Request, res: Response) {
    try {
        const pedidoId = req.params.id;
        const updatedData = req.body.sanitizedInput;

        const pedidoExiste = await repository.findOne({ id: pedidoId });

        if (!pedidoExiste) {

            const objectIdpedidoId = new ObjectId(pedidoId);

            const pedidoInput = new Pedido(
                updatedData.fecha,
                updatedData.usuario,
                updatedData.libro,
                objectIdpedidoId
            );
            const nuevopedido = await repository.add(pedidoInput);

            if (!nuevopedido) {
                return res.status(500).send({ message: "Error al crear la nueva reseña." });
            }

            return res.status(201).send({ message: 'Reseña creada con éxito.', data: nuevopedido });
        }

        const updatedpedido = await repository.update(pedidoId, updatedData);

        if (!updatedpedido) {
            return res.status(500).send({ message: "Error al actualizar la Reseña" });
        }

        return res.status(200).send({ message: 'Reseña actualizada con éxito.', data: updatedpedido });

    } catch (error) {
        console.error("Error en update:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const pedido = await repository.delete({ id });
        if (!pedido) {
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
        const pedidos = await repository.findByUsuario(usuarioId);

        if (!pedidos || pedidos.length === 0) {
            return res.status(404).send({ message: "No se encontraron reseñas para el Usuario proporcionado." });
        }

        res.status(200).send({ message: 'Reseñas encontradas con éxito.', data: pedidos });
    } catch (error) {
        console.error("Error en findByUsuario:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function findByLibro(req: Request, res: Response) {
    try {
        const libroId = req.params.libroId;
        const pedidos = await repository.findByLibro(libroId);

        if (!pedidos || pedidos.length === 0) {
            return res.status(404).send({ message: "No se encontraron reseñas para el Libro proporcionado." });
        }

        res.status(200).send({ message: 'Reseñas encontradas con éxito.', data: pedidos });
    } catch (error) {
        console.error("Error en findByLibro:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

async function getpedidos(req: Request, res: Response) {
    try {
        const pedidos = await repository.findAll();
        const pedidosIds = pedidos?.map((pedido) => pedido._id);
        res.json({ data: pedidosIds });
    } catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}

export { sanitizeInput, findAll, findOne, add, update, remove, findByUsuario, findByLibro, getpedidos } 