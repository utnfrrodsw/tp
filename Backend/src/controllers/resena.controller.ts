import { Request, Response } from 'express';

export const resenaController = {
  getResenaById: async (req: Request, res: Response): Promise<Response> => {
    // Tu lógica aquí
    return res.send('Reseña obtenida');
  },

  createResena: async (req: Request, res: Response): Promise<Response> => {
    // Tu lógica aquí
    return res.send('Reseña creada');
  },

  updateResena: async (req: Request, res: Response): Promise<Response> => {
    // Tu lógica aquí
    return res.send('Reseña actualizada');
  },

  deleteResena: async (req: Request, res: Response): Promise<Response> => {
    // Tu lógica aquí
    return res.send('Reseña eliminada');
  }
};
