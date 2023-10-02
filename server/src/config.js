//CONFIGURA LAS VARIABLES DE ENTORNO

import { config } from 'dotenv';

 config();

export const PORT = process.env.PORT  
console.log( process.env.PORT  )

export const DB_HOST = process.env.DB_HOST
export const DB_PORT = process.env.DB_PORT  
export const DB_USER = process.env.DB_USER  
export const DB_PASSWORD = process.env.DB_PASSWORD  
export const DB_DATABASE = process.env.DB_DATABASE  
export const TOKEN = process.env.TOKEN