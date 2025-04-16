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
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sys'
  }
}
