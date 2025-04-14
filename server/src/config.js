//CONFIGURA LAS VARIABLES DE ENTORNO

const { config } = require('dotenv');

config();

const PORT = process.env.PORT;
const API_URL = process.env.API_URL;

module.exports = {
  PORT,
  API_URL,
};
