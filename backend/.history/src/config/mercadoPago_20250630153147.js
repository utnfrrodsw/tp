require('dotenv').config();
const mercadopago = require('mercadopago');

mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);

module.exports = mercadopago;


