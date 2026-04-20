import { MikroORM } from '@mikro-orm/mysql';
import config from '../mikro-orm.config';
import { Libro } from '../entities/libro.entity';
import axios from 'axios';

async function replaceGoogleBooksContentWithOpenLibrary() {
  const orm = await MikroORM.init(config);
  const em = orm.em.fork();

  try {
    console.log('\n🔄 REEMPLAZANDO URLs DE GOOGLE BOOKS/CONTENT CON OPEN LIBRARY\n');
    console.log('='.repeat(70));

    // Buscar libros con URLs de books.google.com/books/content
    const libros = await em.find(Libro, {}, { populate: ['autor'] });
    
    const problemBooks = libros.filter(l => 
      l.imagen && l.imagen.includes('books.google.com/books/content')
    );

    console.log(`\n📊 Encontrados ${problemBooks.length} libros para procesar\n`);

    let fixed = 0;
    let failed = 0;

    for (const libro of problemBooks) {
      console.log(`\n📖 ${libro.nombre}`);
      console.log(`   Autor: ${libro.autor?.nombre || 'N/A'}`);

      try {
        const query = `${libro.nombre} ${libro.autor?.nombre || ''}`.trim();
        const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=1`;
        
        console.log(`   🔍 Buscando en Open Library...`);
        
        const response = await axios.get(url, { timeout: 10000 });
        
        if (response.data.docs && response.data.docs.length > 0) {
          const book = response.data.docs[0];
          
          if (book.cover_i) {
            const newImageUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
            
            libro.imagen = newImageUrl;
            await em.flush();
            
            console.log(`   ✅ ACTUALIZADA`);
            console.log(`   Nueva URL: ${newImageUrl}`);
            fixed++;
          } else {
            console.log(`   ⚠️  No tiene cover_i`);
            failed++;
          }
        } else {
          console.log(`   ❌ No se encontró en Open Library`);
          failed++;
        }
      } catch (error: any) {
        console.log(`   ❌ Error: ${error.message}`);
        failed++;
      }

      // Pausa para no saturar la API
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log('-'.repeat(70));
    }

    console.log('\n📊 RESUMEN:');
    console.log(`✅ Imágenes actualizadas: ${fixed}`);
    console.log(`❌ Sin actualizar: ${failed}`);
    console.log(`📚 Total procesados: ${problemBooks.length}`);
    console.log(`📈 Tasa de éxito: ${((fixed / problemBooks.length) * 100).toFixed(1)}%`);

    if (fixed > 0) {
      console.log('\n✨ ¡Recarga el navegador para ver las nuevas imágenes!');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await orm.close();
  }
}

replaceGoogleBooksContentWithOpenLibrary();
