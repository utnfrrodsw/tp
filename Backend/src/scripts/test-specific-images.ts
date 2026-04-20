import axios from 'axios';

const testImages = [
  {
    id: 68,
    titulo: 'La travesía del Viajero del Alba',
    url: 'https://books.google.com/books/content?id=XAJ4EAAAQBAJ&printsec=frontcover&img=1&zoom=2&edge=curl&source=gbs_api'
  },
  {
    id: 78,
    titulo: 'Divergente',
    url: 'https://books.google.com/books/content?id=4NNkEAAAQBAJ&printsec=frontcover&img=1&zoom=2&edge=curl&source=gbs_api'
  },
  {
    id: 90,
    titulo: 'Tormenta de espadas',
    url: 'https://books.google.com/books/content?id=Hc42AwAAQBAJ&printsec=frontcover&img=1&zoom=2&edge=curl&source=gbs_api'
  }
];

async function testImage(id: number, titulo: string, url: string) {
  try {
    console.log(`\n🔍 Probando: ${titulo}`);
    console.log(`📍 URL: ${url}`);
    
    const response = await axios.head(url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`📝 Content-Type: ${response.headers['content-type']}`);
    console.log(`📏 Content-Length: ${response.headers['content-length']}`);
    
    return true;
  } catch (error: any) {
    console.log(`❌ Error: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
    }
    return false;
  }
}

async function testAll() {
  console.log('🧪 PROBANDO IMÁGENES PROBLEMÁTICAS\n');
  console.log('='.repeat(60));
  
  let working = 0;
  let broken = 0;
  
  for (const img of testImages) {
    const result = await testImage(img.id, img.titulo, img.url);
    if (result) {
      working++;
    } else {
      broken++;
    }
    console.log('-'.repeat(60));
  }
  
  console.log('\n📊 RESUMEN:');
  console.log(`✅ Funcionando: ${working}`);
  console.log(`❌ Rotas: ${broken}`);
}

testAll();
