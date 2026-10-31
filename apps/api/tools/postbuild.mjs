import { writeFileSync } from 'node:fs';

// Node decide ESM/CJS por el package.json más cercano al archivo ejecutado;
// el bundle de Vercel sólo contiene dist, así que la marca viaja ahí.
writeFileSync(
  new URL('../dist/package.json', import.meta.url),
  JSON.stringify({ type: 'module' }, null, 2)
);
