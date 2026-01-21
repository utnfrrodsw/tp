// src/app.ts
import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors'; 
import { MikroORM } from '@mikro-orm/core';
import config from './mikro-orm.config';

// Importar rutas
import usuarioRoutes from './routes/usuarioRoutes';
import camisetaRoutes from './routes/camisetaRoutes';
import categoriaRoutes from './routes/categoriaRoutes';
import ofertaRoutes from './routes/ofertaRoutes';
import subastaRoutes from './routes/subastaRoutes';
import compraRoutes from './routes/compraRoutes';
import pagoRoutes from './routes/pagoRoutes';
import descuentoRoutes from './routes/descuentoRoutes';
import metodoPagoRoutes from './routes/metodoPagoRoutes';
import adminRoutes from './routes/adminRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import authRouter from './controllers/AuthController';
import authMiddleware from './middleware/auth';
import roleGuard from './middleware/roleGuard';
import imagenRoutes from './routes/ImagenRoutes';

let app: express.Express;
let orm: MikroORM;

export async function createApp() {
  orm = await MikroORM.init(config);


  app = express();
  // Middleware para parsear JSON en el body (debe ir antes de cualquier middleware que use req.body)
  app.use(express.json());

  // Servir archivos estáticos para imágenes (debe ir antes de las rutas API)
  const path = require('path');
  app.use('/uploads', express.static(path.resolve(__dirname, '../public/uploads')));

  // CORS
  const defaultAllowed = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
  ];

  const envAllowed = process.env.ALLOWED_ORIGINS?.split(',').map(s => s.trim()).filter(Boolean) ?? [];
  const allowedOrigins = envAllowed.length > 0 ? envAllowed : defaultAllowed;

  app.use(cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      const isAllowed = allowedOrigins.includes(origin);
      if (isAllowed || process.env.NODE_ENV !== 'production') return cb(null, true);
      return cb(new Error(`CORS origin not allowed: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));


  app.use((req, res, next) => {
    console.log(`🔍 ${req.method} ${req.url}`);
    console.log('📦 Body:', req.body);
    console.log('🌐 Origin:', req.get('origin'));
    next();
  });

  app.locals.orm = orm;
  app.use('/api/auth', authRouter(orm));
  app.use('/api/usuarios', usuarioRoutes);
  app.use('/api/categorias', categoriaRoutes);
  app.use('/api/camisetas', camisetaRoutes);
  app.use('/api/ofertas', ofertaRoutes);
  app.use('/api/subastas', subastaRoutes);
  app.use('/api/compras', compraRoutes);
  app.use('/api/pagos', pagoRoutes);
  app.use('/api/descuentos', descuentoRoutes);
  app.use('/api/metodos-pago', metodoPagoRoutes);  
  app.use('/api/imagenes', imagenRoutes); 
  app.use('/api/admin', adminRoutes);  

  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ 
      success: true, 
      message: 'API Tienda Retro funcionando',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      endpoints: [
        'GET /api/health',
        'GET /api/usuarios',
        'POST /api/usuarios',
        'GET /api/camisetas',
        'POST /api/camisetas',
        'POST /api/camisetas/publicar',
        'GET /api/categorias',
        'POST /api/categorias'
      ]
    });
  });

  app.get('/api/debug/echo', (req: Request, res: Response) => {
    res.json({ success: true, query: req.query });
  });

  app.get('/api/protegida/admin', authMiddleware, roleGuard(['admin']), (req, res) => {
    res.json({ 
      success: true, 
      message: 'Acceso permitido para admin',
      usuario: req.user 
    });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

if (require.main === module) {
  (async () => {
    const app = await createApp();
  const PORT = Number(process.env.PORT) || 3000;
    const HOST = process.env.HOST || '0.0.0.0';
    app.listen(PORT, HOST, () => {
      console.log(`Servidor corriendo en http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
      console.log(`Health check: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/api/health`);
      console.log(`Escuchando en interfaces: ${HOST}`);
    });
  })();
}

