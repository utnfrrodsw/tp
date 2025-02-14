import { PedidoRepository } from "./Pedido.repository.js";
import { UsuarioRepository } from "../Usuario/Usuario.repository.js";
import { LibroRepository } from "../Libro/Libro.repository.js";
import { Pedido } from "./Pedido.js";
const repository = new PedidoRepository();
const usuarioRepository = new UsuarioRepository();
const libroRepository = new LibroRepository();
async function sanitizeInput(req, res, next) {
    try {
        req.body.sanitizedInput = {
            fecha: req.body.fecha,
            usuario: req.body.usuario,
            libro: req.body.libro,
        };
        // Eliminar claves no definidas
        Object.keys(req.body.sanitizedInput).forEach(key => {
            if (req.body.sanitizedInput[key] === undefined) {
                delete req.body.sanitizedInput[key];
            }
        });
        next();
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function findAll(req, res) {
    try {
        const data = await repository.findAll();
        res.json({ data });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function findOne(req, res) {
    try {
        const id = req.params.id;
        const pedido = await repository.findOne({ id });
        if (!pedido) {
            return res.status(404).send({ message: "Compra no encontrado." });
        }
        return res.json({ data: pedido });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function add(req, res) {
    try {
        const input = req.body.sanitizedInput;
        const usuarioExistente = await usuarioRepository.findOne({ id: input.usuario });
        if (!usuarioExistente) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        }
        for (const libroId of input.libro) {
            const libroExistente = await libroRepository.findOne({ id: libroId });
            if (!libroExistente) {
                return res.status(404).send({ message: `Libro con ID ${libroId} no encontrado.` });
            }
        }
        const pedidoInput = new Pedido(input.libro, input.fecha, input.usuario);
        const pedido = await repository.add(pedidoInput);
        res.status(201).send({ message: 'Pedido creado con éxito.', data: pedido });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function update(req, res) {
    try {
        const id = req.params.id;
        const input = req.body.sanitizedInput;
        if (input.usuario) {
            const usuarioExistente = await usuarioRepository.findOne({ id: input.usuario });
            if (!usuarioExistente) {
                return res.status(404).send({ message: "Usuario no encontrado." });
            }
        }
        if (input.libro) {
            for (const libroId of input.libro) {
                const libroExistente = await libroRepository.findOne({ id: libroId });
                if (!libroExistente) {
                    return res.status(404).send({ message: `Libro con ID ${libroId} no encontrado.` });
                }
            }
        }
        const pedidoActualizado = await repository.update(id, input);
        if (!pedidoActualizado) {
            return res.status(404).send({ message: "Pedido no encontrado." });
        }
        res.status(200).send({ message: 'Pedido actualizado con éxito.', data: pedidoActualizado });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function remove(req, res) {
    try {
        const id = req.params.id;
        const pedidoEliminado = await repository.delete({ id });
        if (!pedidoEliminado) {
            return res.status(404).send({ message: "Pedido no encontrado." });
        }
        res.status(200).send({ message: 'Pedido eliminado con éxito.', data: pedidoEliminado });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
export { sanitizeInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=Pedido.controller.js.map