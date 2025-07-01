const OrderProduct = require('../models/orderProduct');
const { Order, Product } = require('../models');

const actualizarTotalOrden = async (orderId) => {
  const productos = await OrderProduct.findAll({
    where: { orderId },
    include: [Product],
  });

  const nuevoTotal = productos.reduce((acc, item) => {
    const precio = item.price_at_purchase || item.Product?.price || 0;
    return acc + item.quantity * precio;
  }, 0);

  await Order.update({ totalAmount: nuevoTotal }, { where: { id: orderId } });
};

// Crear relación
exports.create = async (req, res) => {
  try {
    const { orderId, productId, quantity, price_at_purchase } = req.body;

    const newEntry = await OrderProduct.create({
      orderId,
      productId,
      quantity,
      price_at_purchase
    });

    await actualizarTotalOrden(orderId);

    res.status(201).json(newEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear OrderProduct' });
  }
};

// Obtener todas
exports.getAll = async (req, res) => {
  try {
    const all = await OrderProduct.findAll({ include: [Order, Product] });
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los registros' });
  }
};

// Obtener una por ID compuesta
exports.getById = async (req, res) => {
  try {
    const { orderId, productId } = req.params;
    const entry = await OrderProduct.findOne({
      where: { orderId, productId },
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

// Actualizar cantidad y precio
exports.update = async (req, res) => {
  try {
    const { orderId, productId } = req.params;
    const { quantity, price_at_purchase } = req.body;

    const entry = await OrderProduct.findOne({
      where: { orderId, productId }
    });

    if (!entry) {
      return res.status(404).json({ error: 'No encontrado' });
    }

    await entry.update({ quantity, price_at_purchase });

    await actualizarTotalOrden(orderId);

    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar' });
  }
};

// Eliminar
exports.remove = async (req, res) => {
  try {
    const { orderId, productId } = req.params;

    const result = await OrderProduct.destroy({
      where: { orderId, productId }
    });

    if (result === 0) {
      return res.status(404).json({ error: 'No encontrado' });
    }

    await actualizarTotalOrden(orderId);

    res.json({ message: 'Eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
};

