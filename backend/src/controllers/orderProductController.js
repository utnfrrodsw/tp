const OrderProduct = require('../models/orderProduct');
const Order = require('../models/order');
const Product = require('../models/Product');

// Crear una relación pedido-producto
exports.create = async (req, res) => {
  try {
    const { orderId, productId, quantity } = req.body;

    const newEntry = await OrderProduct.create({
      OrderId: orderId,
      ProductId: productId,
      quantity
    });

    res.status(201).json(newEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear OrderProduct' });
  }
};

// Obtener todas las relaciones
exports.getAll = async (req, res) => {
  try {
    const all = await OrderProduct.findAll({ include: [Order, Product] });
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los registros' });
  }
};

// Obtener una relación por ID (combinado)
exports.getById = async (req, res) => {
  try {
    const { orderId, productId } = req.params;
    const entry = await OrderProduct.findOne({
      where: { OrderId: orderId, ProductId: productId },
      include: [Order, Product]
    });

    if (!entry) {
      return res.status(404).json({ error: 'No encontrado' });
    }

    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el registro' });
  }
};

// Actualizar cantidad
exports.update = async (req, res) => {
  try {
    const { orderId, productId } = req.params;
    const { quantity } = req.body;

    const entry = await OrderProduct.findOne({
      where: { OrderId: orderId, ProductId: productId }
    });

    if (!entry) {
      return res.status(404).json({ error: 'No encontrado' });
    }

    entry.quantity = quantity;
    await entry.save();

    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar' });
  }
};

// Eliminar relación
exports.remove = async (req, res) => {
  try {
    const { orderId, productId } = req.params;

    const result = await OrderProduct.destroy({
      where: { OrderId: orderId, ProductId: productId }
    });

    if (result === 0) {
      return res.status(404).json({ error: 'No encontrado' });
    }

    res.json({ message: 'Eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
};
