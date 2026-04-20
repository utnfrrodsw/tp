import { redis } from './src/redis';

async function clearRedisCache() {
  try {
    if (!redis) {
      console.log('❌ Redis no está disponible');
      process.exit(1);
    }

    console.log('🔄 Limpiando caché de Redis...');
    await redis.flushall();
    console.log('✅ Caché de Redis limpiado exitosamente');
    
    await redis.quit();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al limpiar caché:', error);
    process.exit(1);
  }
}

clearRedisCache();
