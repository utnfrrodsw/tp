const mercadopago = require('../config/mercadoPago');

const createPreference = async (req, res) => {
  const { items, orderId } = req.body;

  try {
    const preference = {
      items: items.map(item => ({
        title: item.name,
        unit_price: item.price,
        quantity: item.quantity,
        currency_id: 'ARS'
      })),
      external_reference: orderId.toString(),
      back_urls: {
        success: "http://localhost:4200/payment-success",
        failure: "http://localhost:4200/payment-failure",
        pending: "http://localhost:4200/payment-pending"
      },
      auto_return: "approved"
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id }); // ID de preferencia para el frontend
  } catch (error) {
    console.error("Error al crear preferencia:", error);
    res.status(500).json({ error: "No se pudo crear la preferencia de pago" });
  }
};

module.exports = { createPreference };
