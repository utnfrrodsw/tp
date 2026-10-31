import type { RequestHandler } from 'express';
import { initOrm } from '../config/orm.js';

export const ensureOrm: RequestHandler = async (_req, _res, next) => {
  try {
    await initOrm();
    next();
  } catch (error) {
    next(error);
  }
};