//CONFIGURACIONES DE EXPRESS: llama a las rutas,  configuras la instancia de Express y aplicas middleware

import express from 'express';
import usuariosRoutes from '../src/routes/usuarios/usuariosRoutes.js';
import './config.js';

const app = express()

app.use(express.json())
 
app.use('/api',usuariosRoutes)

app.use((req,res,next) =>{
    res.status(404).json({
        message: 'endpoint not fount'
    })
})

export default app