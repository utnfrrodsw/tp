require('dotenv').config();
const mercadopago = require('mercadopago');

// Inicializamos la SDK con el Access Token
const mp = new mercadopago.SDK(process.env.MP_ACCESS_TOKEN);

module.exports = mp;



