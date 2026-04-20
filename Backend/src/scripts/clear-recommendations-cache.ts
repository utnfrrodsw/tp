import Redis from 'ioredis';

async function clearRecommendationsCache() {
  const redisUrl = process.env.REDIS_URL;
  
  if (!redisUrl) {
    console.log('⚠️  Redis no está configurado (modo mock). No hay caché que limpiar.');
    return;
  }
  
  const redis = new Redis(redisUrl);
  
  try {
    console.log('🧹 LIMPIANDO CACHÉ DE RECOMENDACIONES\n');
    console.log('='.repeat(60));
    
    // Buscar todas las keys de recomendaciones
    const keys = await redis.keys('recomendaciones:*');
    
    console.log(`\n📊 Encontradas ${keys.length} keys de recomendaciones en caché`);
    
    if (keys.length === 0) {
      console.log('✅ No hay caché que limpiar');
      return;
    }
    
    console.log('\n🗑️  Eliminando caché...\n');
    
    // Eliminar todas las keys
    for (const key of keys) {
      await redis.del(key);
      console.log(`   ✅ Eliminada: ${key}`);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log(`✅ ${keys.length} keys eliminadas correctamente`);
    console.log('✨ Los usuarios verán las nuevas imágenes en su próxima visita');
    
  } catch (error) {
    console.error('❌ Error al limpiar caché:', error);
  } finally {
    await redis.quit();
  }
}

clearRecommendationsCache();
