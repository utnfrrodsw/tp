
const OrderProducts = require('../models/orderProducts');
const { Order, User } = require('../models');

const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { totalAmount, items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'El pedido debe tener al menos un producto.' });
    }

    // Crear la orden principal
    const order = await Order.create({ userId, totalAmount });

    // Crear los registros en OrderProducts
    const orderProductItems = items.map(item => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price_at_purchase: item.price_at_purchase,
    }));

    await OrderProducts.bulkCreate(orderProductItems);

    res.status(201).json({
      message: 'Pedido creado con éxito',
      orderId: order.id,
      productos: orderProductItems,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear pedido', error: err.message });
  }
};


const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: {
        model: User,
        attributes: ['id', 'name', 'email'], // lo que querés traer
      },
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener pedidos' });
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
    if (!['pendiente', 'enviado', 'entregado'].includes(status)) { // ver idioma aca
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
