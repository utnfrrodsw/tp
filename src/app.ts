import express from "express";
import 'reflect-metadata';
import { PersonasRouter } from "./personas/personas.routes.js";
import { BeneficiosRouter } from './beneficios/beneficios.routes.js';
import { orm } from "./shared/db/orm.js";
import { RequestContext } from '@mikro-orm/core';
import { WalletRouter } from "./wallet/wallet.routes.js";
import { NotificacionRouter } from "./notificacion/notificacion.routes.js";
import { RubrosRouter } from "./rubros/rubros.routes.js";
import { LocalidadRouter } from "./localidad/localidad.routes.js";
import { CiudadRouter  } from "./ciudad/ciudad.routes.js";
import { AuthRouter } from "./APIS/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

// Configuración de CORS para permitir múltiples orígenes
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:8081',
  'http://192.168.1.2:8080',
  'http://192.168.1.2:8081'
];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir peticiones sin origin (como desde Postman o apps móviles)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Permite enviar cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

app.use('/api/auth', AuthRouter)
app.use('/api/personas', PersonasRouter)
app.use('/api/beneficios', BeneficiosRouter)
app.use('/api/wallets', WalletRouter)
app.use('/api/notificaciones', NotificacionRouter)
app.use('/api/rubros', RubrosRouter)
app.use('/api/localidades', LocalidadRouter)
app.use('/api/ciudades', CiudadRouter);
/*const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '../public');*/

/*app.use('/virtual-wallets', express.static(path.join(publicDir, 'virtual-wallets')));
app.get(/^\/virtual-wallets(?:\/.*)?$/, (_req, res) => {
  res.sendFile(path.join(publicDir, 'virtual-wallets', 'index.html'));
});*/

app.use((_, res) => {
  res.status(404).send({ message: 'Resource not found' })
  return
})

app.listen(3000, () => {
  console.log('Server is running on port http://localhost:3000');
});
