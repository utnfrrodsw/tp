const Order = require('../models/order');

const createOrder = async (req, res) => {
  try {
    const { userId, totalAmount } = req.body;
    const order = await Order.create({ userId, totalAmount });
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear pedido' });
  }
};

const getAllOrders = async (req, res) => {
    try {
      const orders = await Order.findAll();
      res.json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener pedidos' });
    }
  };
  

const getOrderById = async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
      res.json(order);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener pedido' });
    }
  };

const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });

    const { status } = req.body;
    if (!['pendiente', 'enviado', 'entregado'].includes(status)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    await order.update({ status });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar estado' });
  }
};

const deleteOrder = async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
  
      await order.destroy();
      res.json({ message: 'Pedido eliminado correctamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al eliminar pedido' });
    }
  };

module.exports = { createOrder, getOrderById, updateOrder, deleteOrder, getAllOrders };
