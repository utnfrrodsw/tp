require('dotenv').config();
const mercadopago = require('mercadopago');

// Inicializamos la SDK de Mercado Pago con el Access Token
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

module.exports = mercadopago;



