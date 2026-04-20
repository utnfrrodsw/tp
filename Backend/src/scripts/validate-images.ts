import { MikroORM } from '@mikro-orm/core';
import { Libro } from '../entities/libro.entity';
import mikroOrmConfig from '../mikro-orm.config';
import axios from 'axios';

/**
 * Script para validar URLs de imágenes de libros
 * Verifica qué imágenes son accesibles y cuáles están rotas
 */

interface ValidationStats {
  total: number;
  sinImagen: number;
  imagenValida: number;
  imagenRota: number;
  timeout: number;
}

async function validarUrlImagen(url: string, timeout: number = 5000): Promise<boolean> {
  try {
    const response = await axios.head(url, {
      timeout,
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 400
    });
    
    // Verificar que sea una imagen
    const contentType = response.headers['content-type'];
    return contentType ? contentType.startsWith('image/') : false;
  } catch (error) {
    return false;
  }
}

async function validarImagenesLibros() {
  console.log('🔍 Iniciando validación de imágenes de libros...\n');
  
  const orm = await MikroORM.init(mikroOrmConfig);
  const em = orm.em.fork();

  try {
    const libros = await em.find(Libro, {}, { 
      populate: ['autor', 'categoria'],
      orderBy: { id: 'ASC' }
    });

    const stats: ValidationStats = {
      total: libros.length,
      sinImagen: 0,
      imagenValida: 0,
      imagenRota: 0,
      timeout: 0
    };

    console.log(`📚 Analizando ${libros.length} libros...\n`);

    const librosProblematicos: Array<{
      id: number;
      titulo: string;
      imagen: string | null;
      problema: string;
    }> = [];

    for (let i = 0; i < libros.length; i++) {
      const libro = libros[i];
      const progreso = `[${i + 1}/${libros.length}]`;

      if (!libro.imagen) {
        console.log(`❌ ${progreso} "${libro.nombre}" - Sin imagen`);
        stats.sinImagen++;
        librosProblematicos.push({
          id: libro.id,
          titulo: libro.nombre || 'Sin título',
          imagen: null,
          problema: 'Sin imagen'
        });
        continue;
      }

      // Validar URL
      const esValida = await validarUrlImagen(libro.imagen);
      
      if (esValida) {
        console.log(`✅ ${progreso} "${libro.nombre}" - Imagen OK`);
        stats.imagenValida++;
      } else {
        console.log(`⚠️  ${progreso} "${libro.nombre}" - Imagen rota: ${libro.imagen}`);
        stats.imagenRota++;
        librosProblematicos.push({
          id: libro.id,
          titulo: libro.nombre || 'Sin título',
          imagen: libro.imagen,
          problema: 'URL inaccesible o no es imagen'
        });
      }

      // Pequeña pausa para no saturar
      if (i % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Mostrar estadísticas
    console.log('\n' + '='.repeat(80));
    console.log('📊 ESTADÍSTICAS DE VALIDACIÓN:');
    console.log('='.repeat(80));
    console.log(`Total de libros: ${stats.total}`);
    console.log(`✅ Imágenes válidas: ${stats.imagenValida} (${((stats.imagenValida / stats.total) * 100).toFixed(1)}%)`);
    console.log(`❌ Sin imagen: ${stats.sinImagen} (${((stats.sinImagen / stats.total) * 100).toFixed(1)}%)`);
    console.log(`⚠️  Imágenes rotas: ${stats.imagenRota} (${((stats.imagenRota / stats.total) * 100).toFixed(1)}%)`);
    console.log('='.repeat(80));

    // Mostrar libros problemáticos
    if (librosProblematicos.length > 0) {
      console.log('\n🔴 LIBROS QUE NECESITAN ATENCIÓN:');
      console.log('='.repeat(80));
      librosProblematicos.forEach(({ id, titulo, imagen, problema }) => {
        console.log(`\nID: ${id}`);
        console.log(`Título: ${titulo}`);
        console.log(`Problema: ${problema}`);
        if (imagen) console.log(`URL: ${imagen}`);
      });
      console.log('='.repeat(80));
    }

    console.log('\n💡 RECOMENDACIONES:');
    if (stats.sinImagen > 0) {
      console.log(`- ${stats.sinImagen} libros sin imagen. Ejecutar populate-missing-images.ts para buscarlas.`);
    }
    if (stats.imagenRota > 0) {
      console.log(`- ${stats.imagenRota} libros con imágenes rotas. Considerar:
  1. Buscar imágenes alternativas en APIs (Google Books, Hardcover, Open Library)
  2. Limpiar las URLs rotas de la base de datos
  3. Ejecutar script de población para reemplazarlas`);
    }
    if (stats.imagenValida === stats.total) {
      console.log('- ✨ ¡Todas las imágenes están funcionando correctamente!');
    }

  } catch (error) {
    console.error('❌ Error durante la validación:', error);
  } finally {
    await orm.close();
    console.log('\n✅ Validación completada');
  }
}

// Ejecutar script
validarImagenesLibros().catch(console.error);
