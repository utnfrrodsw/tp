// mercadopago.js
require('dotenv').config();
const mercadopago = require('mercadopago');

const mp = new mercadopago.SDK({
  access_token: process.env.MP_ACCESS_TOKEN,
});

module.exports = mp;

