import { MikroORM } from '@mikro-orm/core';
import { Libro } from '../entities/libro.entity';
import mikroOrmConfig from '../mikro-orm.config';

/**
 * Script para convertir URLs de imágenes HTTP a HTTPS
 * Evita problemas de contenido mixto en navegadores modernos
 */

async function convertirHttpAHttps() {
  console.log('🔄 Iniciando conversión de HTTP a HTTPS...\n');
  
  const orm = await MikroORM.init(mikroOrmConfig);
  const em = orm.em.fork();

  try {
    // Buscar libros con imágenes HTTP
    const libros = await em.find(Libro, {}, {
      populate: ['autor'],
      orderBy: { id: 'ASC' }
    });

    const librosConHttp = libros.filter(l => 
      l.imagen && l.imagen.startsWith('http://')
    );

    console.log(`📚 Total de libros: ${libros.length}`);
    console.log(`🔍 Libros con HTTP: ${librosConHttp.length}\n`);

    if (librosConHttp.length === 0) {
      console.log('✨ ¡Todas las URLs ya usan HTTPS!');
      return;
    }

    let convertidas = 0;

    for (let i = 0; i < librosConHttp.length; i++) {
      const libro = librosConHttp[i];
      const urlAnterior = libro.imagen;
      const urlNueva = urlAnterior!.replace('http://', 'https://');
      
      libro.imagen = urlNueva;
      await em.persistAndFlush(libro);
      
      console.log(`✅ [${i + 1}/${librosConHttp.length}] "${libro.nombre}"`);
      console.log(`   Antes:  ${urlAnterior?.substring(0, 80)}...`);
      console.log(`   Después: ${urlNueva.substring(0, 80)}...\n`);
      
      convertidas++;
    }

    console.log('='.repeat(80));
    console.log('📊 RESUMEN:');
    console.log('='.repeat(80));
    console.log(`✅ URLs convertidas: ${convertidas}`);
    console.log('='.repeat(80));

  } catch (error) {
    console.error('❌ Error durante la conversión:', error);
  } finally {
    await orm.close();
    console.log('\n✅ Conversión completada');
  }
}

// Ejecutar script
convertirHttpAHttps().catch(console.error);
