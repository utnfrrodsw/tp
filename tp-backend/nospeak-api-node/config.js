
require('dotenv').config();

const config = {
  databaseConnectionString: process.env.DATABASE_CONNECTION_STRING,
  tokenSecretKey: process.env.TOKEN_SECRET_KEY,
};

module.exports = config;
