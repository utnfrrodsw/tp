// Controller de los planes: traduce HTTP <-> service. No consulta la base ni arma
// respuestas de error a mano.
//
// En Express 5 no hace falta try/catch: si el service lanza, el error llega solo
// al middleware de manejo de errores.
import { Request, Response } from 'express';
import { planService } from './plan.service';
import { PlanIdParam, UpdatePlanPriceInput } from './plan.schema';

export const planController = {
  // El listado no recibe filtros, así que no lee nada de la request.
  async list(_req: Request, res: Response): Promise<void> {
    const plans = await planService.list();
    res.status(200).json(plans);
  },

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.validated.params as PlanIdParam;
    const plan = await planService.getById(id);
    res.status(200).json(plan);
  },

  async updatePrice(req: Request, res: Response): Promise<void> {
    const { id } = req.validated.params as PlanIdParam;
    const { amount } = req.validated.body as UpdatePlanPriceInput;
    const plan = await planService.updatePrice(id, amount);
    res.status(200).json(plan);
  },
};
