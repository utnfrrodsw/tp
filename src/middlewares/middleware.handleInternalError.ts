import { Request, Response, NextFunction } from "express";

export function handleInternalError(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.stack);
  return res.status(500).json({
    error: "Error interno del servidor",
    mensaje: "Ocurrió un error inesperado",
    codigo: "ERROR_INTERNO",
  });
}
