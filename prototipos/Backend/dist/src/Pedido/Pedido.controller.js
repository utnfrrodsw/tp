import { PedidoRepository } from "./Pedido.repository.js";
import { Pedido } from "./Pedido.js";
const repository = new PedidoRepository();
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
        const pedidoInput = new Pedido(input.libro, input.usuario, input.fecha);
        const pedido = await repository.add(pedidoInput);
        res.status(201).send({ message: 'Compra agregado con éxito.', data: pedido });
    }
    catch (error) {
        res.status(500).send({ message: "Error interno del servidor." });
    }
}
export { sanitizeInput, findAll, findOne, add };
//# sourceMappingURL=Pedido.controller.js.map