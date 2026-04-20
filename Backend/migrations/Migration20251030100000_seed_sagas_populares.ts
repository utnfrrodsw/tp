import { Migration } from '@mikro-orm/migrations';

export class Migration20251030100000_seed_sagas_populares extends Migration {

  async up(): Promise<void> {
    // Insertar sagas populares conocidas
    // Nota: Los libros deberán asociarse manualmente o mediante el script seed-sagas.ts
    
    const sagas = [
      { nombre: 'Harry Potter', descripcion: 'Serie de fantasía sobre el joven mago Harry Potter' },
      { nombre: 'El Señor de los Anillos', descripcion: 'Épica trilogía de fantasía de J.R.R. Tolkien' },
      { nombre: 'Canción de Hielo y Fuego', descripcion: 'Serie de novelas de fantasía épica de George R.R. Martin' },
      { nombre: 'Crónicas de Narnia', descripcion: 'Serie de siete novelas de fantasía de C.S. Lewis' },
      { nombre: 'Percy Jackson', descripcion: 'Serie de aventuras sobre mitología griega de Rick Riordan' },
      { nombre: 'Los Juegos del Hambre', descripcion: 'Trilogía distópica de Suzanne Collins' },
      { nombre: 'Divergente', descripcion: 'Trilogía distópica de Veronica Roth' },
      { nombre: 'Maze Runner', descripcion: 'Serie de ciencia ficción distópica de James Dashner' },
      { nombre: 'Crepúsculo', descripcion: 'Serie de romance paranormal de Stephenie Meyer' },
      { nombre: 'Las Crónicas de Belgarath', descripcion: 'Serie de fantasía épica de David Eddings' }
    ];

    for (const saga of sagas) {
      this.addSql(`
        insert into \`saga\` (\`nombre\`, \`created_at\`)
        values ('${saga.nombre}', NOW())
        on duplicate key update \`nombre\` = \`nombre\`;
      `);
    }

    console.log(`✅ Insertadas ${sagas.length} sagas populares`);
    console.log('📝 Para asociar libros a las sagas, usa: npx ts-node src/seed-sagas.ts "Nombre Saga" "query"');
  }

  async down(): Promise<void> {
    // Eliminar las sagas creadas
    const sagasToDelete = [
      'Harry Potter',
      'El Señor de los Anillos',
      'Canción de Hielo y Fuego',
      'Crónicas de Narnia',
      'Percy Jackson',
      'Los Juegos del Hambre',
      'Divergente',
      'Maze Runner',
      'Crepúsculo',
      'Las Crónicas de Belgarath'
    ];

    for (const nombre of sagasToDelete) {
      this.addSql(`delete from \`saga\` where \`nombre\` = '${nombre}';`);
    }
  }

}
