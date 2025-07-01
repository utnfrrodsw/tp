const mp = require('../config/mercadoPago');

const createPreference = async (req, res) => {
  try {
    const { items, payerEmail } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No hay productos en el carrito' });
    }

    const preference = await mp.preferences.create({
      items: items.map(item => ({
        title: item.title,
        unit_price: Number(item.unit_price),
        quantity: Number(item.quantity),
        currency_id: 'ARS'
      })),
      payer: {
        email: payerEmail || 'test_user@test.com'
      },
      back_urls: {
        success: 'http://localhost:4200/checkout/success',
        failure: 'http://localhost:4200/checkout/failure',
        pending: 'http://localhost:4200/checkout/pending'
      },
      auto_return: 'approved'
    });

    res.status(200).json({ id: preference.id });
  } catch (err) {
    console.error('Error al crear preferencia:', err);
    res.status(500).json({ error: 'Error al crear preferencia de pago' });
  }
};

module.exports = { createPreference };
