import mysql from 'mysql2/promise'

export const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'MICAvalle19',
    database: process.env.DB_NAME || 'BD',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, 
    idleTimeout: 60000, 
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  })