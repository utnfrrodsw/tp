const { Op } = require('sequelize');
const { Order, User, Product } = require('../models');
const OrderProducts = require('../models/orderProduct');
const { Sequelize } = require('sequelize');





const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { totalAmount, items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'El pedido debe tener al menos un producto.' });
    }

    // Creo orden
    const order = await Order.create({ userId, totalAmount });

    // Obtener productos del carrito
    const productIds = items.map(item => item.productId);
    const productosDB = await Product.findAll({ where: { id: { [Op.in]: productIds } } });

    // Valido stock suficiente s
    for (const item of items) {
      const prod = productosDB.find(p => p.id === item.productId);
      if (!prod) {
        return res.status(404).json({ message: `Producto con ID ${item.productId} no encontrado` });
      }
      if (prod.stock < item.quantity) {
        return res.status(400).json({ message: `Stock insuficiente para el producto ${prod.name}` });
      }
    }

    // Preparar productos para crear en OrderProducts con precio
    const orderProductItems = items.map(item => {
      const precio = productosDB.find(p => p.id === item.productId)?.price || 0;
      return {
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price_at_purchase: precio,
      };
    });

    
    await OrderProducts.bulkCreate(orderProductItems);

    // Actualizar stock de cada producto
    for (const item of items) {
      const prod = productosDB.find(p => p.id === item.productId);
      if (prod) {
        await prod.update({ stock: prod.stock - item.quantity });
      }
    }

    res.status(201).json({
      message: 'Pedido creado con éxito',
      orderId: order.id,
      productos: orderProductItems,
    });
  } catch (err) {
    console.error('Error en createOrder:', err);
    res.status(500).json({ message: 'Error al crear pedido', error: err.message });
  }
};



//  Obtener todas las órdenes con relaciones
const getAllOrders = async (req, res) => {
  try {
    const { id, user, dateFrom, dateTo, product, minTotal, maxTotal, status } = req.query;

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

    if (id) {
      where.id = parseInt(id);
    }

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


const getTopSellingProducts= async (req, res) => {
  try {
    const productos = await OrderProduct.findAll({
      attributes: [
        'productId',
        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalVendidas']
      ],
      group: ['productId', 'Product.id'],
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'price']
        }
      ],
      order: [[Sequelize.literal('totalVendidas'), 'DESC']],
      limit: 10 //  los 10 más vendidos, si quieren cambiamos a mas o menos
    });

    res.json(productos);
  } catch (err) {
    console.error('Error al obtener productos más vendidos:', err);
    res.status(500).json({ message: 'Error al obtener productos más vendidos' });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getUserOrders,
  getTopSellingProducts,
};

