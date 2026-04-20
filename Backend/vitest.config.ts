import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // Entorno de testing
    environment: 'node',
    
    // Archivos de test
    include: ['src/**/*.{test,spec}.{js,ts}'],
    exclude: ['node_modules', 'dist', 'migrations', 'src/__tests__/setup.ts'],
    
    // Globals (opcional, similar a Jest)
    globals: false,
    
    // Coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'migrations/',
        'src/__tests__/',
        '**/*.spec.ts',
        '**/*.test.ts',
        'src/index.ts',
        'mikro-orm.config.ts',
        'seed-sagas.ts',
        'create-admin.ts',
        'export-sagas.ts'
      ],
      // Target: 80% coverage mínimo
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80
      }
    },
    
    // Timeouts
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Watch mode
    watch: false,
    
    // Reporters
    reporters: ['verbose']
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@controllers': path.resolve(__dirname, './src/controllers'),
      '@services': path.resolve(__dirname, './src/services'),
      '@middleware': path.resolve(__dirname, './src/middleware'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@shared': path.resolve(__dirname, './src/shared')
    }
  }
});
