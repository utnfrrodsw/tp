import { Request, Response, NextFunction } from 'express';
import { TOKEN_SECRET } from '../APIS/jwd.js';
import jwt from 'jsonwebtoken';



// Extender el tipo Request para incluir decoded
declare global {
  namespace Express {
    interface Request {
      decoded?: any;
    }
  }
}

async function authRequiredToken(req: Request, res: Response, next: NextFunction) {
   const { token } = req.cookies;
   
    if (!token) { 
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token, TOKEN_SECRET);
        req.decoded = decoded;
        next();
    } catch (err: any) {
        return res.status(403).json({ message: 'Invalid token' });
    }
}

export { authRequiredToken };


