import { initTRPC } from '@trpc/server';
import { orm } from '../shared/db/orm.js';
import superjson from 'superjson';

// Context que se pasará a todos los procedures
export interface Context {
  em: typeof orm.em;
}

// Función para crear el context
export const createContext = (): Context => {
  return {
    em: orm.em
  };
};

// Inicializar tRPC con superjson transformer
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

// Export router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;