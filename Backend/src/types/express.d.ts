// src/types/express.d.ts
import { JwtPayload } from 'jsonwebtoken';
import { MikroORM } from '@mikro-orm/mysql';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      app: {
        get(name: 'orm'): MikroORM;
      };
    }
  }
}

export {};
