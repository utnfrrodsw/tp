import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/mysql';
import config from './mikro-orm.config';

// Singleton ORM instance
let orm: MikroORM | null = null;
let isInitialized = false;
let initPromise: Promise<MikroORM | null> | null = null;

/**
 * Initialize ORM singleton - called only once
 */
export async function initializeORM(): Promise<MikroORM | null> {
  // Si ya está inicializando, retornar la promesa existente
  if (initPromise) {
    return initPromise;
  }

  // Si ya está inicializado, retornar la instancia
  if (isInitialized && orm) {
    return orm;
  }

  initPromise = (async () => {
    try {
      console.log('[ORM] Initializing MikroORM...');
      orm = await MikroORM.init(config);
      
      // Try to connect, but don't fail if DB is unavailable
      try {
        console.log('[ORM] Attempting database connection...');
        await orm.connect();
        console.log('✅ [ORM] Database connection established');
      } catch (connectError: any) {
        console.warn('⚠️ [ORM] Database connection failed at startup:', connectError.message);
        console.warn('⚠️ [ORM] Lazy connections will be used when queries are executed');
      }

      isInitialized = true;
      console.log('✅ [ORM] MikroORM initialized successfully (singleton)');
      return orm;
    } catch (error: any) {
      console.error('❌ [ORM] Failed to initialize MikroORM:', error.message);
      isInitialized = false;
      orm = null;
      throw error;
    }
  })();

  return initPromise;
}

/**
 * Get ORM singleton instance
 */
export function getORM(): MikroORM | null {
  if (!isInitialized) {
    console.warn('⚠️ [ORM] ORM not yet initialized');
    return null;
  }
  return orm;
}

/**
 * Check if ORM is initialized
 */
export function isORMInitialized(): boolean {
  return isInitialized && orm !== null;
}

/**
 * Close ORM connections
 */
export async function closeORM(): Promise<void> {
  if (orm) {
    try {
      console.log('[ORM] Closing database connections...');
      await orm.close();
      orm = null;
      isInitialized = false;
      console.log('✅ [ORM] Database connections closed');
    } catch (error) {
      console.error('❌ [ORM] Error closing ORM:', error);
      throw error;
    }
  }
}
