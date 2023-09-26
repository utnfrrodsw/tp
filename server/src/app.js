//APP TIENE TODAS LAS CONFIGURACIONES DE EXPRESS, LLAMA A LAS RUTAS

import express from 'express';
import './config.js';
import usuariosRoutes from './routes/usuariosRouter.js';

const app = express()

app.use(express.json())
 
app.use('/api',usuariosRoutes)

app.use((req,res,next) =>{
    res.status(404).json({
        message: 'endpoint not fount'
    })
})

export default app