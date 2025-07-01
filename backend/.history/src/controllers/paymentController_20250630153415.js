const mercadopago = require('../config/mercadoPago');

const createPreference = async (req, res) => {
  try {
    const { items, back_urls } = req.body;

    const preference = {
      items,
      back_urls: back_urls || {
        success: 'http://localhost:4200/success',
        failure: 'http://localhost:4200/failure',
        pending: 'http://localhost:4200/pending',
      },
      auto_return: 'approved',
    };

    const response = await mercadopago.preferences.create(preference);

    res.json({ id: response.body.id });
  } catch (error) {
    console.error('Error creating Mercado Pago preference:', error);
    res.status(500).json({ error: 'Error creating payment preference' });
  }
};

module.exports = {
  createPreference,
};
