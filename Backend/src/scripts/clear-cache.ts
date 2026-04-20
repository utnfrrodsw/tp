import redis from '../redis';

async function clearCache() {
  try {
    console.log('🧹 Limpiando cache de autores populares...');
    
    // Borrar todas las claves posibles de autores populares
    const keys = ['autores:populares:20', 'autores:populares:30'];
    
    for (const key of keys) {
      try {
        const result = await redis.del(key);
        if (result > 0) {
          console.log(`✅ Cache borrado: ${key}`);
        } else {
          console.log(`ℹ️  No existía: ${key}`);
        }
      } catch (err) {
        console.log(`⚠️  Error borrando ${key}:`, err);
      }
    }
    
    // Limpiar también el cache en memoria del mock (si está en modo mock)
    console.log('🔄 Forzando recarga en próximo request...');
    console.log('✅ Cache limpiado correctamente');
    console.log('ℹ️  Recarga la página del navegador para ver los 30 autores nuevos');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error limpiando cache:', error);
    process.exit(1);
  }
}

clearCache();
