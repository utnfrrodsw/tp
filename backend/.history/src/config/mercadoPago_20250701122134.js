require('dotenv').config();
const mercadopago = require('mercadopago');

mercadopago.configurations = {
  access_token: process.env.MP_ACCESS_TOKEN
};

module.exports = mercadopago;