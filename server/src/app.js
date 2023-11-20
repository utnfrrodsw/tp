//CONFIGURACIONES DE EXPRESS: llama a las rutas,  configuras la instancia de Express y aplicas middleware
const express = require('express');
const app = express();

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

//rutas
app.get("/", (req, res) => {
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

module.exports = app;

