declare global {
  namespace Express {
    interface Request {
      user?: import('jsonwebtoken').JwtPayload;
    }
  }
}

export {};
