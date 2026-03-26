const { Op } = require('sequelize');
const { Order, User, Product } = require('../models');
const OrderProducts = require('../models/orderProduct');

//  Crear orden con productos asociados
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { totalAmount, items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'El pedido debe tener al menos un producto.' });
    }

    const order = await Order.create({ userId, totalAmount });

    const orderProductItems = items.map(item => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price_at_purchase: item.price_at_purchase, // 
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

//  Obtener todas las órdenes con relaciones
const getAllOrders = async (req, res) => {
  try {
    const { user, dateFrom, dateTo, product, minTotal, maxTotal, status } = req.query;

    const where = {};
    const include = [
      {
        model: User,
        attributes: ['id', 'name', 'email'],
      },
      {
        model: Product,
        as: 'productos',
        attributes: ['id', 'name', 'price'],
        through: { attributes: ['quantity', 'price_at_purchase'] },
      }
    ];

    // Filtros dinámicos
    if (status) {
      where.status = status;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt[Op.gte] = new Date(dateFrom);
      if (dateTo) where.createdAt[Op.lte] = new Date(dateTo);
    }

    if (minTotal || maxTotal) {
      where.totalAmount = {};
      if (minTotal) where.totalAmount[Op.gte] = parseFloat(minTotal);
      if (maxTotal) where.totalAmount[Op.lte] = parseFloat(maxTotal);
    }

    if (user) {
      include[0].where = {
        [Op.or]: [
          { name: { [Op.like]: `%${user}%` } },
          { email: { [Op.like]: `%${user}%` } }
        ]
      };
    }

    if (product) {
      include[1].where = {
        name: { [Op.like]: `%${product}%` }
      };
    }

    const orders = await Order.findAll({
      where,
      include,
      order: [['createdAt', 'DESC']],
    });

    res.json(orders);
  } catch (err) {
    console.error('Error al obtener pedidos:', err);
    res.status(500).json({ message: 'Error al obtener pedidos' });
  }
};

//  Obtener orden por ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          as: 'productos',
          through: { attributes: ['quantity', 'price_at_purchase'] }
        },
        {
          model: User,
          attributes: ['id', 'name']
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    // Si el usuario autenticado NO es el dueño del pedido Y no es admin, rechazar
    if (order.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'No tienes permiso para ver este pedido' });
    }

    res.json(order);
  } catch (err) {
    console.error('Error al obtener pedido por ID:', err);
    res.status(500).json({ message: 'Error al obtener pedido' });
  }
};


//  Actualizar estado
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });

    const { status } = req.body;
    if (!['pendiente', 'enviado', 'entregado', 'cancelado'].includes(status)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    await order.update({ status });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar estado' });
  }
};

//  Eliminar orden
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

//Obtener pedidos del usuario
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: 'productos', attributes: ['id', 'name', 'price'],
          through: { attributes: ['quantity', 'price_at_purchase'] }
        }
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(orders);
  } catch (err) {
    console.error('Error al obtener pedidos del usuario:', err);
    res.status(500).json({ message: 'Error al obtener tus pedidos' });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getUserOrders,
};

