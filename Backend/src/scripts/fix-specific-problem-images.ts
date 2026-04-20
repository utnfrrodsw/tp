import { MikroORM } from '@mikro-orm/mysql';
import config from '../mikro-orm.config';
import { Libro } from '../entities/libro.entity';
import axios from 'axios';

const GOOGLE_BOOKS_API_KEY = 'AIzaSyD-s15g5g_Gy8eP-k1iPT1cBJyPtV7Lsm4';

interface BookSearchResult {
  id: number;
  titulo: string;
  autor: string;
  imagenActual: string;
}

async function searchGoogleBooksImage(titulo: string, autor: string): Promise<string | null> {
  try {
    const query = `${titulo} ${autor}`.trim();
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=1`;
    
    console.log(`   🔍 Buscando: "${query}"`);
    
    const response = await axios.get(url, { timeout: 10000 });
    
    if (response.data.items && response.data.items.length > 0) {
      const book = response.data.items[0];
      const imageLinks = book.volumeInfo?.imageLinks;
      
      if (imageLinks) {
        // Intentar obtener la mejor calidad disponible
        let imageUrl = imageLinks.extraLarge || imageLinks.large || imageLinks.medium || 
                      imageLinks.thumbnail || imageLinks.smallThumbnail;
        
        if (imageUrl) {
          // Asegurar HTTPS y zoom máximo
          imageUrl = imageUrl.replace('http://', 'https://');
          imageUrl = imageUrl.replace('&zoom=1', '&zoom=2');
          
          console.log(`   ✅ Imagen encontrada`);
          return imageUrl;
        }
      }
    }
    
    console.log(`   ❌ No se encontró imagen`);
    return null;
  } catch (error: any) {
    console.log(`   ❌ Error: ${error.message}`);
    return null;
  }
}

async function searchOpenLibraryImage(titulo: string, autor: string): Promise<string | null> {
  try {
    const query = `${titulo} ${autor}`.trim();
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=1`;
    
    console.log(`   🔍 Buscando en Open Library...`);
    
    const response = await axios.get(url, { timeout: 10000 });
    
    if (response.data.docs && response.data.docs.length > 0) {
      const book = response.data.docs[0];
      
      if (book.cover_i) {
        const imageUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
        console.log(`   ✅ Imagen encontrada`);
        return imageUrl;
      }
    }
    
    console.log(`   ❌ No se encontró imagen`);
    return null;
  } catch (error: any) {
    console.log(`   ❌ Error: ${error.message}`);
    return null;
  }
}

async function fixSpecificImages() {
  const orm = await MikroORM.init(config);
  const em = orm.em.fork();

  try {
    console.log('\n🔧 BUSCANDO IMÁGENES ALTERNATIVAS PARA LIBROS PROBLEMÁTICOS\n');
    console.log('='.repeat(70));

    const problemBooks: BookSearchResult[] = [
      {
        id: 68,
        titulo: 'La travesía del Viajero del Alba',
        autor: 'C.S. Lewis',
        imagenActual: 'https://books.google.com/books/content?id=XAJ4EAAAQBAJ&printsec=frontcover&img=1&zoom=2&edge=curl&source=gbs_api'
      },
      {
        id: 78,
        titulo: 'Divergente',
        autor: 'Veronica Roth',
        imagenActual: 'https://books.google.com/books/content?id=4NNkEAAAQBAJ&printsec=frontcover&img=1&zoom=2&edge=curl&source=gbs_api'
      },
      {
        id: 90,
        titulo: 'Tormenta de espadas',
        autor: 'George R.R. Martin',
        imagenActual: 'https://books.google.com/books/content?id=Hc42AwAAQBAJ&printsec=frontcover&img=1&zoom=2&edge=curl&source=gbs_api'
      }
    ];

    let fixed = 0;
    let failed = 0;

    for (const bookData of problemBooks) {
      console.log(`\n📖 ${bookData.titulo}`);
      console.log(`   Autor: ${bookData.autor}`);
      console.log(`   URL actual: ${bookData.imagenActual.substring(0, 60)}...`);

      // Buscar en Google Books API (diferente endpoint)
      let newImageUrl = await searchGoogleBooksImage(bookData.titulo, bookData.autor);

      // Si no se encuentra, buscar en Open Library
      if (!newImageUrl) {
        newImageUrl = await searchOpenLibraryImage(bookData.titulo, bookData.autor);
      }

      if (newImageUrl) {
        const libro = await em.findOne(Libro, { id: bookData.id });
        
        if (libro) {
          libro.imagen = newImageUrl;
          await em.persistAndFlush(libro);
          
          console.log(`   ✅ ACTUALIZADA`);
          console.log(`   Nueva URL: ${newImageUrl.substring(0, 60)}...`);
          fixed++;
        }
      } else {
        console.log(`   ❌ NO SE PUDO ENCONTRAR ALTERNATIVA`);
        failed++;
      }

      console.log('-'.repeat(70));
    }

    console.log('\n📊 RESUMEN:');
    console.log(`✅ Imágenes actualizadas: ${fixed}`);
    console.log(`❌ Sin alternativa: ${failed}`);

    if (fixed > 0) {
      console.log('\n✨ Las imágenes han sido actualizadas en la base de datos');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await orm.close();
  }
}

fixSpecificImages();
