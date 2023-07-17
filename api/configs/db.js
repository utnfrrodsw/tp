const { mysql } = require('./config')
const Sequelize = require('sequelize')

const sequelize = new Sequelize(
  mysql.database,
  mysql.user,
  mysql.password,
  {
    host: mysql.host,
    dialect: 'mysql'
  }
)

const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

module.exports = {
  connectDB,
  sequelize
}
