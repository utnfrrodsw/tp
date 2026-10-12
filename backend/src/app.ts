// Configuración de la aplicación Express: middlewares globales, rutas y manejo
// de errores. Se separa de server.ts para poder importar la app en los tests de
// integración sin levantar el servidor en un puerto.
import cors from 'cors';
import express from 'express';
import { env } from './shared/config/env';
import { errorHandler } from './shared/middlewares/error-handler';
import { notFoundHandler } from './shared/middlewares/not-found';
import { router } from './routes';

export const app = express();

// Express anuncia por defecto "X-Powered-By: Express": no le sirve a nadie salvo
// a quien busca vulnerabilidades conocidas de esa tecnología.
app.disable('x-powered-by');

// En producción la API corre detrás del proxy del hosting, y sin esto req.ip
// sería siempre la IP del proxy: el rate limit trataría a todos los usuarios
// como uno solo. En desarrollo no hay proxy y se deja como viene.
if (env.isProduction) app.set('trust proxy', 1);

// Headers de seguridad básicos para una API que solo devuelve JSON: que el
// navegador no adivine el tipo de contenido, que nadie la meta en un iframe y que
// no se filtre la URL de origen en el Referer.
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

// El frontend corre en otro origen (Vite en 5173 y siguientes), así que necesita
// CORS explícito. env.corsOrigin es una lista: el paquete cors acepta el array y
// habilita cualquiera de esos orígenes.
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  })
);

// Parseo del body JSON de las requests.
app.use(express.json());

// Todas las rutas del sistema cuelgan de /api.
app.use('/api', router);

// El orden de estos dos middlewares importa y va siempre al final:
// primero el 404 para rutas no registradas, después el manejador de errores.
app.use(notFoundHandler);
app.use(errorHandler);
