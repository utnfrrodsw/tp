import { Response, NextFunction, Request } from 'express';
import { AuthUser } from '../types/auth';

export default function roleGuard(required: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as AuthUser | undefined;
    if (!user) return res.status(401).json({ error: 'No autorizado' });
    if (!required.includes(user.rol as any)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}
