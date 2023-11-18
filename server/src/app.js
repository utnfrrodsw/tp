//CONFIGURACIONES DE EXPRESS: llama a las rutas,  configuras la instancia de Express y aplicas middleware
const express = require('express');
const app = express();

const { PORT } = require('./config');

app.set("port", PORT || 5000); //seteamos el puerto que nos da el servidor o el 5000


const cors = require('cors');
app.use(cors());

//path
const path = require("path");
const publicPath = path.resolve(__dirname, "../public");
app.use(express.static(publicPath));


//rutas
const usuariosRoutes = require( './routes/usuariosRoutes.js');
const solicitudRoutes = require('./routes/solicitudRoutes.js');
const direccionesRoutes = require('./routes/direccionesRoutes.js');
const profesionesRouter = require('./routes/profesionesRouter');
const presupuestosRoutes = require('./routes/presupuestosRoutes.js');
const serviciosRoutes = require('./routes/servicioRoutes.js');

//use app
app.use(express.json());

app.listen(app.get("port"), () => {
    console.log(`Server corriendo en el puerto ${app.get("port") || 5000}`);
});

//rutas
app.use("/", (req, res) => {
    res.send("api fast services funcionando");
});

app.use("/api/usuario", usuariosRoutes);
app.use('/api/solicitud', solicitudRoutes);
app.use('/api/direccion', direccionesRoutes);
app.use('/api/profesion', profesionesRouter);
app.use('/api/presupuesto', presupuestosRoutes);
app.use('/api/servicio', serviciosRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Error interno del servidor',
        error: err.message
    });
});

export default app;

