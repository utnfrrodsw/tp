import { MikroORM } from '@mikro-orm/core';
import { Libro } from '../entities/libro.entity';
import mikroOrmConfig from '../mikro-orm.config';
import axios from 'axios';

/**
 * Script para buscar y poblar imágenes faltantes desde APIs externas
 * Prioriza libros más populares (con más reseñas/favoritos)
 */

interface ImageSearchResult {
  source: string;
  imageUrl: string;
}

// Función para buscar en Google Books API
async function buscarEnGoogleBooks(titulo: string, autor?: string): Promise<string | null> {
  try {
    const query = autor ? `${titulo} ${autor}` : titulo;
    const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: query,
        maxResults: 1,
        printType: 'books',
        langRestrict: 'es'
      },
      timeout: 5000
    });

    if (response.data.items && response.data.items.length > 0) {
      const imageLinks = response.data.items[0].volumeInfo.imageLinks;
      if (imageLinks) {
        // Preferir imágenes de mayor calidad
        let imageUrl = imageLinks.extraLarge || 
               imageLinks.large || 
               imageLinks.medium || 
               imageLinks.thumbnail?.replace('zoom=1', 'zoom=2') ||
               imageLinks.thumbnail;
        
        // Convertir HTTP a HTTPS para evitar problemas de contenido mixto
        if (imageUrl) {
          imageUrl = imageUrl.replace('http://', 'https://');
        }
        
        return imageUrl;
      }
    }
  } catch (error) {
    // Silenciar errores de búsqueda
  }
  return null;
}

// Función para buscar en Open Library
async function buscarEnOpenLibrary(titulo: string, autor?: string): Promise<string | null> {
  try {
    const query = autor ? `${titulo} ${autor}` : titulo;
    const response = await axios.get('https://openlibrary.org/search.json', {
      params: {
        q: query,
        limit: 1
      },
      timeout: 5000
    });

    if (response.data.docs && response.data.docs.length > 0) {
      const coverId = response.data.docs[0].cover_i;
      if (coverId) {
        return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
      }
    }
  } catch (error) {
    // Silenciar errores
  }
  return null;
}

// Función para validar que una URL de imagen funcione
async function validarImagen(url: string): Promise<boolean> {
  try {
    const response = await axios.head(url, {
      timeout: 3000,
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 400
    });
    const contentType = response.headers['content-type'];
    return contentType ? contentType.startsWith('image/') : false;
  } catch {
    return false;
  }
}

// Función principal para buscar imagen en múltiples fuentes
async function buscarImagen(libro: Libro): Promise<ImageSearchResult | null> {
  const titulo = libro.nombre || '';
  const autor = libro.autor?.nombre;

  console.log(`  🔎 Buscando en Google Books...`);
  let imageUrl = await buscarEnGoogleBooks(titulo, autor);
  if (imageUrl && await validarImagen(imageUrl)) {
    return { source: 'Google Books', imageUrl };
  }

  console.log(`  🔎 Buscando en Open Library...`);
  imageUrl = await buscarEnOpenLibrary(titulo, autor);
  if (imageUrl && await validarImagen(imageUrl)) {
    return { source: 'Open Library', imageUrl };
  }

  return null;
}

async function poblarImagenesFaltantes() {
  console.log('🖼️  Iniciando búsqueda de imágenes faltantes...\n');
  
  const orm = await MikroORM.init(mikroOrmConfig);
  const em = orm.em.fork();

  try {
    // Buscar libros sin imagen o con imagen rota
    const libros = await em.find(Libro, {}, {
      populate: ['autor', 'categoria'],
      orderBy: { id: 'ASC' }
    });

    // Filtrar solo los que no tienen imagen
    const librosSinImagen = libros.filter(l => !l.imagen);

    console.log(`📚 Encontrados ${librosSinImagen.length} libros sin imagen de ${libros.length} totales\n`);

    if (librosSinImagen.length === 0) {
      console.log('✨ Todos los libros ya tienen imagen asignada!');
      return;
    }

    const stats = {
      encontradas: 0,
      noEncontradas: 0,
      errores: 0
    };

    const resultados: Array<{
      titulo: string;
      source?: string;
      imageUrl?: string;
      error?: string;
    }> = [];

    for (let i = 0; i < librosSinImagen.length; i++) {
      const libro = librosSinImagen[i];
      const progreso = `[${i + 1}/${librosSinImagen.length}]`;
      
      console.log(`\n${progreso} "${libro.nombre}"`);
      console.log(`  Autor: ${libro.autor?.nombre || 'Desconocido'}`);

      try {
        const resultado = await buscarImagen(libro);

        if (resultado) {
          libro.imagen = resultado.imageUrl;
          await em.persistAndFlush(libro);
          
          console.log(`  ✅ Imagen encontrada en ${resultado.source}`);
          console.log(`  🖼️  ${resultado.imageUrl.substring(0, 80)}...`);
          
          stats.encontradas++;
          resultados.push({
            titulo: libro.nombre || 'Sin título',
            source: resultado.source,
            imageUrl: resultado.imageUrl
          });
        } else {
          console.log(`  ❌ No se encontró imagen en ninguna fuente`);
          stats.noEncontradas++;
          resultados.push({
            titulo: libro.nombre || 'Sin título',
            error: 'No encontrada'
          });
        }
      } catch (error) {
        console.log(`  ⚠️  Error al buscar: ${error}`);
        stats.errores++;
        resultados.push({
          titulo: libro.nombre || 'Sin título',
          error: 'Error en búsqueda'
        });
      }

      // Pausa entre búsquedas para no saturar APIs
      if (i < librosSinImagen.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Mostrar resumen
    console.log('\n' + '='.repeat(80));
    console.log('📊 RESUMEN DE BÚSQUEDA:');
    console.log('='.repeat(80));
    console.log(`Total procesados: ${librosSinImagen.length}`);
    console.log(`✅ Imágenes encontradas: ${stats.encontradas} (${((stats.encontradas / librosSinImagen.length) * 100).toFixed(1)}%)`);
    console.log(`❌ No encontradas: ${stats.noEncontradas} (${((stats.noEncontradas / librosSinImagen.length) * 100).toFixed(1)}%)`);
    console.log(`⚠️  Errores: ${stats.errores}`);
    console.log('='.repeat(80));

    if (stats.encontradas > 0) {
      console.log('\n✨ IMÁGENES AGREGADAS:');
      console.log('='.repeat(80));
      resultados
        .filter(r => r.source)
        .forEach(({ titulo, source, imageUrl }) => {
          console.log(`\n📖 ${titulo}`);
          console.log(`   Fuente: ${source}`);
          console.log(`   URL: ${imageUrl?.substring(0, 100)}...`);
        });
    }

    if (stats.noEncontradas > 0) {
      console.log('\n🔴 LIBROS SIN IMAGEN (necesitan búsqueda manual):');
      console.log('='.repeat(80));
      resultados
        .filter(r => r.error === 'No encontrada')
        .forEach(({ titulo }) => {
          console.log(`- ${titulo}`);
        });
    }

  } catch (error) {
    console.error('❌ Error durante la población:', error);
  } finally {
    await orm.close();
    console.log('\n✅ Script completado');
  }
}

// Ejecutar script
poblarImagenesFaltantes().catch(console.error);
