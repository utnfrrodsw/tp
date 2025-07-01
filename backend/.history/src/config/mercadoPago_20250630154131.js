require('dotenv').config();
const { MercadoPagoConfig } = require('mercadopago');

// Inicializar SDK
const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

module.exports = mercadopago;



