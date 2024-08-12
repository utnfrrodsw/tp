import { ZodError, ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export function validateInput(
  schemaReq?: ZodObject<any, any>,
  schemaBody?: ZodObject<any, any>
) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      if (schemaReq) {
        schemaReq.parse(req.params);
      }
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Bad request params" });
      }
      next(error);
    }
    try {
      if (schemaBody) {
        schemaBody.parse(req.body);
      }
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Bad request body" });
      }
      next(error);
    }
    next();
  };
}

// El uso de una high order function es "opcional", pero queda más legible. Lo puedo explicar mejor en la defensa.
