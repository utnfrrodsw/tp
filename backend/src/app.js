const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { allowedOrigins } = require('./config/auth');
const { originCheck } = require('./middlewares/csrf');
const { sendError } = require('./utils/http');
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const profesorRoutes = require('./routes/profesorRoutes');
const especialidadRoutes = require('./routes/especialidadRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const rutinaRoutes = require('./routes/rutinaRoutes');

const app = express();

// Cantidad de proxies delante del server (ej. 1 en Render/Railway), para que el rate limit vea la IP real
app.set('trust proxy', Number(process.env.TRUST_PROXY) || false);

app.use(helmet());
// Solo el frontend configurado puede hacer requests con la cookie de sesión
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(originCheck);
app.use(express.json({ limit: '10kb' }));
app.use((req, res, next) => {
  req.body ??= {}; // en Express 5 req.body queda undefined si no hay body JSON
  next();
});
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/profesores', profesorRoutes);
app.use('/api/especialidades', especialidadRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/rutinas', rutinaRoutes);

app.use((req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));

// Evita que Express responda errores con HTML y stack trace
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'JSON inválido' });
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'El body es demasiado grande' });
  }
  sendError(res, 500, 'Error interno del servidor', err);
});

module.exports = app;
