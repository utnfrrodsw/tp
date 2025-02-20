import { PedidoRepository } from "./Pedido.repository.js";
import { Pedido } from "./Pedido.js";
import { ObjectId } from "mongodb";
const repository = new PedidoRepository();
async function sanitizeInput(req, res, next) {
    try {
        const requiredKeys = ['fecha', 'usuario', 'libro'];
        const optionalKeys = ['estado'];
        req.body.sanitizedInput = {};
        for (const key of requiredKeys) {
            if (req.body[key] === undefined) {
                return res.status(400).send({ message: `Campo '${key}' es requerido.` });
            }
            req.body.sanitizedInput[key] = req.body[key];
        }
        // Agregar campos opcionales si están presentes
        for (const key of optionalKeys) {
            if (req.body[key] !== undefined) {
                req.body.sanitizedInput[key] = req.body[key];
            }
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
        if (!id) {
            return res.status(400).send({ message: "ID del pedido no proporcionado." });
        }
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ message: "El ID proporcionado no es válido." });
        }
        const pedido = await repository.findOne({ id });
        if (!pedido) {
            return res.status(404).send({ message: "Pedido no encontrado." });
        }
        return res.json({ data: pedido });
    }
    catch (error) {
        console.error("Error en findOne:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function add(req, res) {
    try {
        const input = req.body.sanitizedInput;
        if (!Array.isArray(input.libro)) {
            return res.status(400).send({ message: "El campo 'libro' debe ser un array." });
        }
        const usuarioId = new ObjectId(input.usuario);
        const libroIds = input.libro.map((libroId) => {
            try {
                return new ObjectId(libroId);
            }
            catch (error) {
                throw new Error(`ID de libro no válido: ${libroId}`);
            }
        });
        const pedidoInput = new Pedido(input.fecha, usuarioId, libroIds, input.estado || "Pendiente" // Usa el estado proporcionado o "Pendiente" por defecto
        );
        const pedido = await repository.add(pedidoInput);
        res.status(201).send({ message: 'Pedido agregado con éxito.', data: pedido });
    }
    catch (error) {
        console.error("Error en add:", error);
        res.status(400).send({ message: 'Error al crear el pedido.' });
    }
}
async function update(req, res) {
    try {
        const pedidoId = req.params.id;
        const updatedData = req.body.sanitizedInput;
        const pedidoExiste = await repository.findOne({ id: pedidoId });
        if (!pedidoExiste) {
            const objectIdPedidoId = new ObjectId(pedidoId);
            const pedidoInput = new Pedido(updatedData.fecha, updatedData.usuario, updatedData.libro, updatedData.estado || "Pendiente", // Usa el estado proporcionado o "Pendiente" por defecto
            objectIdPedidoId);
            const nuevoPedido = await repository.add(pedidoInput);
            if (!nuevoPedido) {
                return res.status(500).send({ message: "Error al crear el nuevo pedido." });
            }
            return res.status(201).send({ message: 'Pedido creado con éxito.', data: nuevoPedido });
        }
        const updatedPedido = await repository.update(pedidoId, updatedData);
        if (!updatedPedido) {
            return res.status(500).send({ message: "Error al actualizar el pedido." });
        }
        return res.status(200).send({ message: 'Pedido actualizado con éxito.', data: updatedPedido });
    }
    catch (error) {
        console.error("Error en update:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function remove(req, res) {
    try {
        const id = req.params.id;
        const pedido = await repository.delete({ id });
        if (!pedido) {
            res.status(404).send({ message: "Reseña no encontrada." });
        }
        res.status(204).send({ message: 'Reseña eliminada con éxito.' });
    }
    catch (error) {
        console.error("Error en remove:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function findByUsuario(req, res) {
    try {
        const usuarioId = req.params.usuarioId;
        const pedidos = await repository.findByUsuario(usuarioId);
        if (!pedidos || pedidos.length === 0) {
            return res.status(404).send({ message: "No se encontraron reseñas para el Usuario proporcionado." });
        }
        res.status(200).send({ message: 'Reseñas encontradas con éxito.', data: pedidos });
    }
    catch (error) {
        console.error("Error en findByUsuario:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function findByLibro(req, res) {
    try {
        const libroId = req.params.libroId;
        const pedidos = await repository.findByLibro(libroId);
        if (!pedidos || pedidos.length === 0) {
            return res.status(404).send({ message: "No se encontraron reseñas para el Libro proporcionado." });
        }
        res.status(200).send({ message: 'Reseñas encontradas con éxito.', data: pedidos });
    }
    catch (error) {
        console.error("Error en findByLibro:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function findByEstado(req, res) {
    try {
        const estado = req.params.estado;
        const pedidos = await repository.findByEstado(estado);
        if (!pedidos || pedidos.length === 0) {
            return res.status(404).send({ message: "No se encontraron pedidos con el estado proporcionado." });
        }
        res.status(200).send({ message: 'Pedidos encontrados con éxito.', data: pedidos });
    }
    catch (error) {
        console.error("Error en findByEstado:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
async function getPedidos(req, res) {
    try {
        const pedidos = await repository.findAll();
        console.log("Pedidos encontrados:", pedidos); // Agrega este log
        const pedidosIds = pedidos?.map((pedido) => pedido._id?.toString());
        res.json({ data: pedidosIds });
    }
    catch (error) {
        console.error("Error en getPedidos:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
export { sanitizeInput, findAll, findOne, add, update, remove, findByUsuario, findByLibro, getPedidos, findByEstado };
//# sourceMappingURL=Pedido.controller.js.map