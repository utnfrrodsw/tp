// Configuración de Playwright para los tests end-to-end.
//
// A diferencia de los tests de Vitest, que montan un componente suelto en un DOM
// falso, acá se levantan las dos apps de verdad y un navegador real las usa como
// las usaría una persona. Requiere además MySQL corriendo con `npm run seed`
// hecho, porque el login busca al usuario administrador en la base.
import { defineConfig, devices } from '@playwright/test';

// Las URLs se pueden cambiar desde el entorno (por ejemplo, si Vite levantó en
// otro puerto); sin variables se usan las de desarrollo local.
const FRONTEND_URL = process.env.E2E_FRONTEND_URL ?? 'http://localhost:5173';
const BACKEND_URL = process.env.E2E_BACKEND_URL ?? 'http://localhost:3000';

export default defineConfig({
  testDir: './e2e',
  // Un test por vez: son pocos y comparten la misma base de datos.
  workers: 1,
  use: {
    baseURL: FRONTEND_URL,
    // Guarda la traza del primer reintento: es lo que permite ver paso a paso
    // qué pasó cuando un test falla, con `npx playwright show-report`.
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Playwright levanta las dos apps antes de empezar y las baja al terminar.
  // Con reuseExistingServer usa las que ya tengas abiertas en vez de fallar
  // porque el puerto está ocupado.
  webServer: [
    {
      command: 'npm run dev',
      cwd: '../backend',
      // Espera a que la API conteste, no solo a que el puerto abra.
      url: `${BACKEND_URL}/api/health`,
      reuseExistingServer: true,
      timeout: 60_000,
    },
    {
      command: 'npm run dev',
      url: FRONTEND_URL,
      reuseExistingServer: true,
      timeout: 60_000,
    },
  ],
});
