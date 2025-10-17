import { router } from './trpc.js';
import { walletRouter } from './routers/wallet.js';
import { personaRouter } from './routers/persona.js';
import { localidadRouter } from './routers/localidad.js';
import { rubroRouter } from './routers/rubro.js';
import { ciudadRouter } from './routers/ciudad.js';
import { beneficioRouter } from './routers/beneficio.js';

// Main tRPC router that combines all sub-routers
export const appRouter = router({
  wallet: walletRouter,
  persona: personaRouter,
  localidad: localidadRouter,
  rubro: rubroRouter,
  ciudad: ciudadRouter,
  beneficio: beneficioRouter,
});

// Export the router type for use in frontend
export type AppRouter = typeof appRouter;