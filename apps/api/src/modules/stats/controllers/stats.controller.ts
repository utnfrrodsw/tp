import { Request, Response } from 'express';

import { getAdminStats, getBusinessStats } from '../services/stats.service.js';
import { sendApiError } from '../../../shared/api-error.js';

export const getAdminDashboardStats = async (_req: Request, res: Response) => {
  try {
    const stats = await getAdminStats();
    res.json(stats);
  } catch (error) {
    sendApiError(res, error, 'Error al obtener las estadísticas');
  }
};

export const getBusinessDashboardStats = async (req: Request, res: Response) => {
  const usuarioId = Number(req.query.usuarioId);

  try {
    const stats = await getBusinessStats(usuarioId);
    res.json(stats);
  } catch (error) {
    sendApiError(res, error, 'Error al obtener las estadísticas');
  }
};
