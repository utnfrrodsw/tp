/**
 * Script para mover reseñas auto-aprobadas (score 70-84) a estado pendiente
 * Ejecutar: npx ts-node fix-resenas-auto-aprobadas.ts
 */

import { MikroORM } from '@mikro-orm/core';
import config from './mikro-orm.config';
import { Resena, EstadoResena } from './src/entities/resena.entity';

async function fixAutoApprovedReviews() {
  console.log('🔧 Iniciando corrección de reseñas auto-aprobadas...\n');
  
  const orm = await MikroORM.init(config);
  const em = orm.em.fork();

  try {
    // Buscar reseñas aprobadas con score entre 70 y 84
    const resenasAutoAprobadas = await em.find(Resena, {
      estado: EstadoResena.APPROVED,
      moderationScore: { $gte: 70, $lt: 85 },
      autoModerated: true
    });

    console.log(`📊 Encontradas ${resenasAutoAprobadas.length} reseñas auto-aprobadas con score 70-84\n`);

    if (resenasAutoAprobadas.length === 0) {
      console.log('✅ No hay reseñas que corregir');
      await orm.close();
      return;
    }

    // Actualizar estado a pendiente
    for (const resena of resenasAutoAprobadas) {
      console.log(`📝 Reseña ID ${resena.id} - Score: ${resena.moderationScore}`);
      console.log(`   Comentario: ${resena.comentario.substring(0, 50)}...`);
      console.log(`   Estado anterior: aprobada → nuevo: pendiente\n`);
      
      resena.estado = EstadoResena.PENDING;
      resena.autoModerated = false;
    }

    await em.flush();

    console.log(`\n✅ ${resenasAutoAprobadas.length} reseñas movidas a estado pendiente`);
    console.log('🎯 Ahora aparecerán en el panel de moderación del admin');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await orm.close();
  }
}

fixAutoApprovedReviews();
