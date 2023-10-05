//CONFIGURACIONES DE EXPRESS: llama a las rutas,  configuras la instancia de Express y aplicas middleware

const express = require('express');
const app = express();
const { PORT } = require('./config');
app.set("port", PORT || 5000); //seteamos el puerto que nos da el servidor o el 5000

//path
const path = require("path");
const publicPath = path.resolve(__dirname, "../public");
app.use(express.static(publicPath));

//rutas
const usuariosRoutes = require( './routes/usuario/usuariosRoutes.js');
const solicitudRoutes = require('./routes/solicitud/solicitudRoutes.js');


app.listen(app.get("port"), () => {
    console.log(`Server corriendo en el puerto ${app.get("port") || 5000}`);
});

app.use('/usuario',usuariosRoutes)
app.use('/solicitud', solicitudRoutes);

app.use((req,res,next) =>{
    res.status(404).json({
        message: 'endpoint not fount'
    })
})


