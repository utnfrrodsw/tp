import { MikroORM } from '@mikro-orm/mysql';
import config from '../mikro-orm.config';
import { Libro } from '../entities/libro.entity';
import axios from 'axios';

const GOOGLE_BOOKS_API_KEY = 'AIzaSyD-s15g5g_Gy8eP-k1iPT1cBJyPtV7Lsm4';

async function findAlternativeForGoogleBooksContent() {
  const orm = await MikroORM.init(config);
  const em = orm.em.fork();

  try {
    console.log('\n🔍 BUSCANDO LIBROS CON URLs PROBLEMÁTICAS DE GOOGLE BOOKS\n');
    console.log('='.repeat(70));

    // Buscar libros con URLs de books.google.com/books/content
    const libros = await em.find(Libro, {}, { populate: ['autor'] });
    
    const problemBooks = libros.filter(l => 
      l.imagen && l.imagen.includes('books.google.com/books/content')
    );

    console.log(`\n📊 Encontrados ${problemBooks.length} libros con URLs potencialmente problemáticas\n`);

    if (problemBooks.length === 0) {
      console.log('✅ No hay libros con URLs problemáticas');
      return;
    }

    let fixed = 0;
    let failed = 0;

    for (const libro of problemBooks) {
      console.log(`\n📖 ${libro.nombre}`);
      console.log(`   Autor: ${libro.autor?.nombre || 'N/A'}`);
      console.log(`   URL actual: ${libro.imagen?.substring(0, 60)}...`);

      // Buscar imagen alternativa en Google Books API (diferente endpoint)
      try {
        const query = `${libro.nombre} ${libro.autor?.nombre || ''}`.trim();
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=1`;
        
        console.log(`   🔍 Buscando alternativa...`);
        
        const response = await axios.get(url, { timeout: 10000 });
        
        if (response.data.items && response.data.items.length > 0) {
          const book = response.data.items[0];
          const imageLinks = book.volumeInfo?.imageLinks;
          
          if (imageLinks) {
            let newImageUrl = imageLinks.extraLarge || imageLinks.large || imageLinks.medium || 
                            imageLinks.thumbnail || imageLinks.smallThumbnail;
            
            if (newImageUrl) {
              newImageUrl = newImageUrl.replace('http://', 'https://');
              newImageUrl = newImageUrl.replace('&zoom=1', '&zoom=2');
              
              // Solo actualizar si es diferente
              if (newImageUrl !== libro.imagen) {
                libro.imagen = newImageUrl;
                await em.persistAndFlush(libro);
                
                console.log(`   ✅ ACTUALIZADA`);
                console.log(`   Nueva URL: ${newImageUrl.substring(0, 60)}...`);
                fixed++;
              } else {
                console.log(`   ⚠️  URL es la misma`);
              }
            }
          }
        } else {
          console.log(`   ❌ No se encontró alternativa`);
          failed++;
        }
      } catch (error: any) {
        console.log(`   ❌ Error: ${error.message}`);
        failed++;
      }

      console.log('-'.repeat(70));
    }

    console.log('\n📊 RESUMEN:');
    console.log(`✅ Imágenes actualizadas: ${fixed}`);
    console.log(`❌ Sin actualizar: ${failed}`);
    console.log(`📚 Total procesados: ${problemBooks.length}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await orm.close();
  }
}

findAlternativeForGoogleBooksContent();
