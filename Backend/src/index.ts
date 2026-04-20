import 'reflect-metadata';
import { initializeORM, getORM, closeORM, isORMInitialized } from './orm';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import redis from './redis';
import express from 'express';

// Cargar variables de entorno desde la raíz
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });
dotenv.config();

import hardcoverRoutes from './routes/hardcover.routes';
import googleBooksRoutes from './routes/googleBooks.routes';
import { authRoutes } from './routes/auth.routes';
import { usuarioRoutes } from './routes/usuario.routes';
import { favoritosRoutes } from './routes/favoritos.routes';
import { listaRoutes } from './routes/lista.routes';
import { sagaRoutes } from './routes/saga.routes';
import { categoriaRoutes } from './routes/categoria.routes';
import { autorRoutes } from './routes/autor.routes';
import { editorialRoutes } from './routes/editorial.routes';
import { libroRoutes } from './routes/libro.routes';
import { resenaRoutes } from './routes/resena.routes';
import { contenidoListaRoutes } from './routes/contenidoLista.routes';
import { reaccionRoutes } from './routes/reaccion.routes';
import { seguimientoRoutes } from './routes/seguimiento.routes';
import { recomendacionRoutes } from './routes/recomendacion.routes';
import { protectedRoutes } from './routes/protected.route';
import { externalAuthorRoutes } from './routes/externalAuthor.routes';
import { actividadRoutes } from './routes/actividad.routes';
import { permisoRoutes } from './routes/permiso.routes';
import { ratingLibroRoutes } from './routes/ratingLibro.routes';
import { feedRoutes } from './routes/feed.routes';
import { statsRoutes } from './routes/stats.routes';
import votacionRoutes from './routes/votacion.routes';
import newsletterRoutes from './routes/newsletter.routes';
import { notificacionRoutes } from './routes/notificacion.routes';
import { adminCatalogRoutes } from './routes/adminCatalog.routes';

import { authenticateJWT } from './middleware/auth.middleware';

async function main() {
  // Crear la aplicación Express
  const app = express(); 
  app.use(express.json());

  // Start listening on port FIRST before initializing DB
  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor en puerto ${PORT}`);
  });

  // Initialize ORM singleton - will only initialize once globally
  try {
    console.log('[APP] Initializing ORM singleton...');
    await initializeORM();
    console.log('[APP] ORM singleton initialized');
  } catch (error) {
    console.error('[APP] Failed to initialize ORM:', error);
  }

  const allowedOrigins = [
    "http://localhost:5173", 
    "http://localhost:5174",
    process.env.FRONTEND_URL || ""
  ].filter(Boolean); 

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      
      console.log('🌐 CORS request from origin:', origin);
      
      if (allowedOrigins.includes(origin)) {
        console.log('✅ Origin allowed from list');
        return callback(null, true);
      }
      
      if (origin.endsWith('.vercel.app') || origin.includes('vercel.app')) {
        console.log('✅ Origin allowed: Vercel deployment');
        return callback(null, true);
      }
      
      console.log('❌ Origin rejected:', origin);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  }));

  // Health check endpoint
  app.get('/health', (req, res) => {
    const ormStatus = isORMInitialized() ? 'connected' : 'disconnected';
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      orm: ormStatus,
      port: PORT
    });
  });

  // Configurar rutas
  app.use('/api/auth', authRoutes);
  app.use('/api/usuarios', usuarioRoutes); 
  app.use('/api/favoritos', favoritosRoutes);
  app.use('/api/lista', listaRoutes);
  app.use('/api/saga', sagaRoutes);
  app.use('/api/categoria', categoriaRoutes);
  app.use('/api/autor', autorRoutes);
  app.use('/api/editorial', editorialRoutes);
  app.use('/api/libro', libroRoutes);
  app.use('/api/resena', resenaRoutes);
  app.use('/api/contenido-lista', contenidoListaRoutes);
  app.use('/api/reaccion', reaccionRoutes);
  app.use('/api/seguimientos', seguimientoRoutes);
  app.use('/api/recomendaciones', recomendacionRoutes);
  app.use('/api/protected', protectedRoutes);
  app.use('/api/google-books', googleBooksRoutes);
  app.use('/api/hardcover', hardcoverRoutes);
  app.use('/api/external-authors', externalAuthorRoutes);
  app.use('/api/actividades', actividadRoutes);
  app.use('/api/permisos', permisoRoutes);
  app.use('/api/feed', feedRoutes);
  app.use('/api/rating-libro', ratingLibroRoutes);
  app.use('/api/stats', statsRoutes); 
  app.use('/api/votacion', votacionRoutes);
  app.use('/api/newsletter', newsletterRoutes);
  app.use('/api/notificaciones', notificacionRoutes);
  app.use('/api/admin/catalogo', adminCatalogRoutes);

  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
      error: err.message || 'Internal Server Error',
    });
  });

  // Store ORM in app context for backward compatibility
  const orm = getORM();
  if (orm) {
    app.set('orm', orm);
  }

  // Graceful shutdown - cerrar conexiones correctamente
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} recibido. Cerrando servidor...`);
    
    server.close(async () => {
      console.log('🔌 Servidor HTTP cerrado');
      
      try {
        await closeORM();
        
        await redis.quit();
        console.log('🔴 Redis desconectado');
        
        process.exit(0);
      } catch (error) {
        console.error('❌ Error al cerrar conexiones:', error);
        process.exit(1);
      }
    });

    // Forzar cierre después de 10 segundos
    setTimeout(() => {
      console.error('⚠️ Forzando cierre después de 10 segundos...');
      process.exit(1);
    }, 10000);
  };

  // Capturar señales de terminación
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((error) => {
  console.error('[APP] Fatal error:', error);
  process.exit(1);
});
