// Middleware que limita cuántas requests puede hacer una misma IP a una ruta en
// una ventana de tiempo. Frena la fuerza bruta en el login, el alta masiva de
// cuentas y el spam al webhook de pagos.
//
//   authRouter.post('/login', rateLimit({ windowMs: 15 * 60_000, max: 10 }), ...);
//
// Se escribió a mano en vez de sumar una librería: son pocas líneas y así se ve
// exactamente qué hace. Guarda los contadores en memoria, así que se reinician al
// reiniciar el servidor; para un solo proceso alcanza.
import { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';
import { AppError } from '../errors/app-error';

type RateLimitOptions = {
  /** Largo de la ventana, en milisegundos. */
  windowMs: number;
  /** Cuántas requests se permiten por IP dentro de la ventana. */
  max: number;
  /** Mensaje que recibe el cliente al pasarse del límite. */
  message?: string;
};

/** Requests contadas para una IP y cuándo vuelve a cero su contador. */
type Counter = { count: number; resetAt: number };

/**
 * Arma un middleware con su propio contador: cada ruta que lo usa lleva la cuenta
 * por separado, así los intentos de login no gastan el cupo del registro.
 * @param options ventana, tope y mensaje.
 * @returns el middleware de Express.
 */
export function rateLimit({
  windowMs,
  max,
  message = 'Hiciste demasiados intentos. Esperá unos minutos y probá de nuevo.',
}: RateLimitOptions) {
  const counters = new Map<string, Counter>();

  return (req: Request, _res: Response, next: NextFunction): void => {
    // En los tests todas las requests vienen de la misma IP y en ráfaga: el
    // límite los haría fallar sin que haya un problema real.
    if (env.nodeEnv === 'test') {
      next();
      return;
    }

    const key = req.ip ?? 'unknown';
    const now = Date.now();
    const counter = counters.get(key);

    // Primera request de la IP, o ya pasó su ventana: arranca de cero. De paso se
    // borran los contadores vencidos para que el Map no crezca para siempre.
    if (!counter || counter.resetAt <= now) {
      for (const [ip, entry] of counters) {
        if (entry.resetAt <= now) counters.delete(ip);
      }
      counters.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    counter.count += 1;

    if (counter.count > max) {
      // 429 Too Many Requests: el formato de error es el de siempre, lo arma el
      // errorHandler.
      next(new AppError(message, 429));
      return;
    }

    next();
  };
}
