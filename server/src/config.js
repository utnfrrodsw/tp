//CONFIGURA LAS VARIABLES DE ENTORNO

const { config } = require('dotenv');

config();

const PORT = process.env.PORT;
const API_URL = process.env.API_URL;
const DB_NAME = process.env.DB_NAME || 'fastservices';
const DB_USER = process.env.DB_USER || 'userRemote';
const DB_PASSWORD = process.env.DB_PASSWORD || 'remote321';
const DB_HOST = process.env.DB_HOST || '100.93.197.20';
const DB_PORT = process.env.DB_PORT || 33061;


module.exports = {
  PORT,
  API_URL,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT
};
