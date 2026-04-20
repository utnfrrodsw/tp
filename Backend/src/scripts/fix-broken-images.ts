import { MikroORM } from '@mikro-orm/core';
import { Libro } from '../entities/libro.entity';
import mikroOrmConfig from '../mikro-orm.config';
import axios from 'axios';

/**
 * Script para reparar imágenes rotas buscando nuevas URLs en APIs externas
 * Verifica y reemplaza URLs inaccesibles
 */

interface ImageSearchResult {
  source: string;
  imageUrl: string;
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

async function repararImagenesRotas() {
  console.log('🔧 Iniciando reparación de imágenes rotas...\n');
  
  const orm = await MikroORM.init(mikroOrmConfig);
  const em = orm.em.fork();

  try {
    // Cargar todos los libros con imágenes
    const libros = await em.find(Libro, {}, {
      populate: ['autor', 'categoria'],
      orderBy: { id: 'ASC' }
    });

    console.log(`📚 Analizando ${libros.length} libros...\n`);

    // Identificar libros con imágenes rotas
    const librosConImagenesRotas: Libro[] = [];

    for (let i = 0; i < libros.length; i++) {
      const libro = libros[i];
      
      if (libro.imagen) {
        const esValida = await validarImagen(libro.imagen);
        if (!esValida) {
          librosConImagenesRotas.push(libro);
        }
      }

      // Progreso cada 20 libros
      if ((i + 1) % 20 === 0) {
        console.log(`   Progreso: ${i + 1}/${libros.length} libros analizados...`);
      }

      // Pausa pequeña para no saturar
      if (i % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`\n⚠️  Encontradas ${librosConImagenesRotas.length} imágenes rotas\n`);

    if (librosConImagenesRotas.length === 0) {
      console.log('✨ ¡Todas las imágenes están funcionando correctamente!');
      return;
    }

    const stats = {
      reparadas: 0,
      noEncontradas: 0,
      errores: 0
    };

    const resultados: Array<{
      id: number;
      titulo: string;
      urlAnterior: string;
      source?: string;
      urlNueva?: string;
      error?: string;
    }> = [];

    // Intentar reparar cada imagen rota
    for (let i = 0; i < librosConImagenesRotas.length; i++) {
      const libro = librosConImagenesRotas[i];
      const progreso = `[${i + 1}/${librosConImagenesRotas.length}]`;
      
      console.log(`\n${progreso} "${libro.nombre}"`);
      console.log(`  Autor: ${libro.autor?.nombre || 'Desconocido'}`);
      console.log(`  ⚠️  URL rota: ${libro.imagen?.substring(0, 80)}...`);

      const urlAnterior = libro.imagen || '';

      try {
        const resultado = await buscarImagen(libro);

        if (resultado) {
          libro.imagen = resultado.imageUrl;
          await em.persistAndFlush(libro);
          
          console.log(`  ✅ Imagen reparada desde ${resultado.source}`);
          console.log(`  🖼️  Nueva URL: ${resultado.imageUrl.substring(0, 80)}...`);
          
          stats.reparadas++;
          resultados.push({
            id: libro.id,
            titulo: libro.nombre || 'Sin título',
            urlAnterior,
            source: resultado.source,
            urlNueva: resultado.imageUrl
          });
        } else {
          console.log(`  ❌ No se encontró imagen alternativa`);
          // Limpiar la URL rota
          libro.imagen = undefined;
          await em.persistAndFlush(libro);
          
          stats.noEncontradas++;
          resultados.push({
            id: libro.id,
            titulo: libro.nombre || 'Sin título',
            urlAnterior,
            error: 'No encontrada - URL limpiada'
          });
        }
      } catch (error) {
        console.log(`  ⚠️  Error al buscar: ${error}`);
        stats.errores++;
        resultados.push({
          id: libro.id,
          titulo: libro.nombre || 'Sin título',
          urlAnterior,
          error: 'Error en búsqueda'
        });
      }

      // Pausa entre búsquedas
      if (i < librosConImagenesRotas.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Mostrar resumen
    console.log('\n' + '='.repeat(80));
    console.log('📊 RESUMEN DE REPARACIÓN:');
    console.log('='.repeat(80));
    console.log(`Total imágenes rotas: ${librosConImagenesRotas.length}`);
    console.log(`✅ Reparadas: ${stats.reparadas} (${((stats.reparadas / librosConImagenesRotas.length) * 100).toFixed(1)}%)`);
    console.log(`❌ No encontradas: ${stats.noEncontradas} (${((stats.noEncontradas / librosConImagenesRotas.length) * 100).toFixed(1)}%)`);
    console.log(`⚠️  Errores: ${stats.errores}`);
    console.log('='.repeat(80));

    if (stats.reparadas > 0) {
      console.log('\n✨ IMÁGENES REPARADAS:');
      console.log('='.repeat(80));
      resultados
        .filter(r => r.source)
        .forEach(({ id, titulo, source, urlNueva }) => {
          console.log(`\n[ID: ${id}] ${titulo}`);
          console.log(`   Fuente: ${source}`);
          console.log(`   Nueva URL: ${urlNueva?.substring(0, 100)}...`);
        });
    }

    if (stats.noEncontradas > 0) {
      console.log('\n🔴 LIBROS SIN IMAGEN ALTERNATIVA (URLs limpiadas, usarán fallback):');
      console.log('='.repeat(80));
      resultados
        .filter(r => r.error?.includes('No encontrada'))
        .forEach(({ id, titulo }) => {
          console.log(`[ID: ${id}] ${titulo}`);
        });
      console.log('\n💡 Estos libros ahora mostrarán el placeholder elegante con su título.');
    }

  } catch (error) {
    console.error('❌ Error durante la reparación:', error);
  } finally {
    await orm.close();
    console.log('\n✅ Reparación completada');
  }
}

// Ejecutar script
repararImagenesRotas().catch(console.error);
