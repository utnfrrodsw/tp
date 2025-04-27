// src/routes/protected.route.ts
import { Request, Response } from 'express';

export const protectedRoute = (req: Request, res: Response) => {
  if (req.user) {
    return res.json({ message: `Hello ${req.user.email}` });
  }
  res.status(401).json({ error: 'No user found' });
};
