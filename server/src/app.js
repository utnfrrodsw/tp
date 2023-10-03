//CONFIGURACIONES DE EXPRESS: llama a las rutas,  configuras la instancia de Express y aplicas middleware

const express = require('express');
const path = require("path");
const app = express();

const usuariosRoutes = require( './routes/usuario/usuariosRoutes.js');
const { PORT } = require('./config');

app.set("port", PORT || 5000); //seteamos el puerto que nos da el servidor o el 5000

app.listen(app.get("port"), () => {
    console.log(`Server corriendo en el puerto ${app.get("port") || 5000}`);
});

app.use('/api',usuariosRoutes)

app.use((req,res,next) =>{
    res.status(404).json({
        message: 'endpoint not fount'
    })
})


