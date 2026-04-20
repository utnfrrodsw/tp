// src/scripts/generate-slugs.ts
import { MikroORM } from '@mikro-orm/core';
import { Libro } from '../entities/libro.entity';
import { generateSlug, generateUniqueSlug } from '../shared/utils/slug.util';
import mikroOrmConfig from '../mikro-orm.config';

async function generateBookSlugs() {
  console.log('🚀 Iniciando generación de slugs para libros...\n');
  
  const orm = await MikroORM.init(mikroOrmConfig);
  const em = orm.em.fork();

  try {
    // Obtener todos los libros
    const libros = await em.find(Libro, {});
    console.log(`📚 Encontrados ${libros.length} libros en la base de datos\n`);

    if (libros.length === 0) {
      console.log('⚠️  No hay libros para procesar');
      await orm.close();
      return;
    }

    const existingSlugs: string[] = [];
    let processed = 0;
    let updated = 0;
    let skipped = 0;

    for (const libro of libros) {
      processed++;

      // Si ya tiene slug, saltar
      if (libro.slug) {
        console.log(`⏭️  [${processed}/${libros.length}] "${libro.nombre}" ya tiene slug: ${libro.slug}`);
        existingSlugs.push(libro.slug);
        skipped++;
        continue;
      }

      // Si no tiene nombre, usar fallback con ID
      const baseText = libro.nombre || `libro-${libro.id}`;
      const baseSlug = generateSlug(baseText);
      
      // Asegurar que el slug sea único
      const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs);
      
      libro.slug = uniqueSlug;
      existingSlugs.push(uniqueSlug);
      updated++;

      console.log(`✅ [${processed}/${libros.length}] "${libro.nombre || 'Sin nombre'}" → ${uniqueSlug}`);
    }

    // Guardar cambios en la base de datos
    await em.flush();

    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN:');
    console.log(`   Total procesados: ${processed}`);
    console.log(`   Slugs generados: ${updated}`);
    console.log(`   Ya tenían slug: ${skipped}`);
    console.log('='.repeat(60));
    console.log('\n✅ Slugs generados exitosamente!\n');

  } catch (error) {
    console.error('\n❌ Error al generar slugs:', error);
    throw error;
  } finally {
    await orm.close();
  }
}

// Ejecutar script
generateBookSlugs()
  .then(() => {
    console.log('🎉 Script completado con éxito');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
