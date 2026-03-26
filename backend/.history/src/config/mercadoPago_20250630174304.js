const { MercadoPagoConfig } = require('mercadopago');

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

console.log('MP_ACCESS_TOKEN:', process.env.MP_ACCESS_TOKEN);

module.exports = mp;






