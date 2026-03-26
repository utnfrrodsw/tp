const { mp } = require('../config/mercadoPago');

const createPreference = async (req, res) => {
  try {
    const { items, payer } = req.body;

    const preference = {
      items: items.map(item => ({
        title: item.title,
        unit_price: item.unit_price,
        quantity: item.quantity,
        currency_id: 'ARS',
      })),
      payer,
      back_urls: {
        success: 'http://localhost:4200/success',
        failure: 'http://localhost:4200/failure',
        pending: 'http://localhost:4200/pending',
      },
      auto_return: 'approved',
    };

    const result = await mp.preference.create({ body: preference });

    res.status(200).json({ init_point: result.init_point });
  } catch (error) {
    console.error('Error al crear preferencia:', error);
    res.status(500).json({ message: 'Error al crear preferencia', error: error.message });
  }
};

module.exports = { createPreference };
