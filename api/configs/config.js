const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  app: {
    port: process.env.PORT
  },
  jwt: {
    signature: process.env.JWT_SIGNATURE
  },
  mysql: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
  }
}
