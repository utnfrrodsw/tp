#!/usr/bin/env ts-node

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const migrationsDir = join(__dirname, '../migrations');

// Migraciones problemáticas conocidas que deben ser vaciadas
const problematicMigrations = [
  'Migration20251031021933_add_slug_to_libro',
  'Migration20251031140000_add_foto_to_autor',
  'Migration20251103194440_add_external_ids_to_autor'
];

const skipPatterns = [
  { pattern: /add \`slug\`/, message: 'columna slug ya existe' },
  { pattern: /add \`foto\`/, message: 'columna foto ya existe' },
  { pattern: /add \`google_books_id\`/, message: 'columnas de external IDs ya existen' }
];

console.log('🔧 Arreglando migraciones problemáticas...\n');

// Leer todos los archivos de migración
const files = readdirSync(migrationsDir).filter(f => f.endsWith('.ts'));

for (const file of files) {
  const migrationName = file.replace('.ts', '');
  
  if (problematicMigrations.includes(migrationName)) {
    const filePath = join(migrationsDir, file);
    let content = readFileSync(filePath, 'utf-8');
    
    // Buscar el patrón problemático
    let skipMessage = 'migración ya aplicada';
    for (const { pattern, message } of skipPatterns) {
      if (pattern.test(content)) {
        skipMessage = message;
        break;
      }
    }
    
    // Buscar el método up() y reemplazarlo
    const upMethodRegex = /(async up\(\): Promise<void> {)[\s\S]*?(^\s{2}})/m;
    
    if (upMethodRegex.test(content)) {
      const newUpMethod = `$1\n    // ${skipMessage}\n    console.log('⏭️ Saltando migración - ${skipMessage}');\n  $2`;
      content = content.replace(upMethodRegex, newUpMethod);
      
      writeFileSync(filePath, content, 'utf-8');
      console.log(`✅ Arreglada: ${migrationName}`);
    } else {
      console.log(`⚠️  No se pudo arreglar: ${migrationName}`);
    }
  }
}

console.log('\n✨ Proceso completado!');
console.log('📝 Ahora ejecuta: npx mikro-orm migration:up');
