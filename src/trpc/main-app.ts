import express from "express";
import 'reflect-metadata';
import { orm } from "../shared/db/orm.js";
import { RequestContext } from '@mikro-orm/core';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './index.js';
import { createContext } from './trpc.js';
import { NotificacionRouter } from "../notificacion/notificacion.routes.js";
import cors from 'cors';
const app = express();

// Middlewares básicos
app.use(express.json());
app.use(cors());

// Middleware para MikroORM context
app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

// tRPC middleware - reemplaza todas las rutas REST
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
    onError: ({ path, error }) => {
      console.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`);
    },
  })
);

// Mantener solo Notificaciones como REST (mientras no se migre)
app.use('/api/notificaciones', NotificacionRouter);

// Health check endpoint
app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_, res) => {
  res.status(404).send({ 
    message: 'Resource not found. Use /trpc for API endpoints or /health for health check' 
  });
});

app.listen(3000, () => {
  console.log('🚀 Server is running on port http://localhost:3000');
  console.log('📡 tRPC endpoint: http://localhost:3000/trpc');
  console.log('🏥 Health check: http://localhost:3000/health');
});
