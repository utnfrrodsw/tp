import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
    // Las variables tienen que existir antes de que se cargue src/config/auth.js
    env: {
      NODE_ENV: 'test',
      JWT_SECRET: 'secreto-solo-para-tests-0123456789-abcdefghij',
      FRONTEND_ORIGIN: 'http://localhost:5173'
    },
    // Los tests de integración comparten la misma base SQLite en memoria de su archivo
    fileParallelism: false
  }
});
