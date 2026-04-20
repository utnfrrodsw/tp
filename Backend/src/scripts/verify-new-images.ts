import axios from 'axios';

const newImages = [
  {
    titulo: 'La travesía del Viajero del Alba',
    url: 'https://covers.openlibrary.org/b/id/9184719-L.jpg'
  },
  {
    titulo: 'Divergente',
    url: 'https://covers.openlibrary.org/b/id/13274634-L.jpg'
  },
  {
    titulo: 'Tormenta de espadas',
    url: 'https://covers.openlibrary.org/b/id/15124196-L.jpg'
  }
];

async function verifyNewImages() {
  console.log('🧪 VERIFICANDO NUEVAS IMÁGENES\n');
  console.log('='.repeat(60));
  
  let working = 0;
  let broken = 0;
  
  for (const img of newImages) {
    console.log(`\n📖 ${img.titulo}`);
    console.log(`📍 ${img.url}`);
    
    try {
      const response = await axios.head(img.url, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      });
      
      console.log(`✅ Status: ${response.status}`);
      console.log(`📝 Type: ${response.headers['content-type']}`);
      console.log(`📏 Size: ${response.headers['content-length']} bytes`);
      working++;
    } catch (error: any) {
      console.log(`❌ Error: ${error.message}`);
      broken++;
    }
    
    console.log('-'.repeat(60));
  }
  
  console.log(`\n📊 RESUMEN:`);
  console.log(`✅ Funcionando: ${working}/3`);
  console.log(`❌ Rotas: ${broken}/3`);
}

verifyNewImages();
