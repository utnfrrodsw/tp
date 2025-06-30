const OrderProducts = require('../models/orderProducts');

// Obtener todos los productos de todas las órdenes
const getAllOrderProducts = async (req, res) => {
  try {
    const orderProducts = await OrderProducts.findAll();
    res.json(orderProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener order-products' });
  }
};

// Crear
const createOrderProduct = async (req, res) => {
  const { orderId, productId, quantity, unitPrice } = req.body;

  try {
    const newOrderProduct = await OrderProducts.create({
      orderId,
      productId,
      quantity,
      unitPrice,
    });
    res.status(201).json(newOrderProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear order-product' });
  }
};

// Actualizar cantidad o precio
const updateOrderProduct = async (req, res) => {
  const { orderId, productId } = req.params;
  const { quantity, unitPrice } = req.body;

  try {
    const orderProduct = await OrderProducts.findOne({
      where: { orderId, productId },
    });

    if (!orderProduct) {
      return res.status(404).json({ error: 'OrderProduct no encontrado' });
    }

    await orderProduct.update({ quantity, unitPrice });
    res.json(orderProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar order-product' });
  }
};

// Eliminar
const deleteOrderProduct = async (req, res) => {
  const { orderId, productId } = req.params;

  try {
    const orderProduct = await OrderProducts.findOne({
      where: { orderId, productId },
    });

    if (!orderProduct) {
      return res.status(404).json({ error: 'OrderProduct no encontrado' });
    }

    await orderProduct.destroy();
    res.json({ message: 'OrderProduct eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar order-product' });
  }
};

module.exports = {
  getAllOrderProducts,
  createOrderProduct,
  updateOrderProduct,
  deleteOrderProduct,
};

