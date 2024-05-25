import { NextFunction, Request, Response } from "express";

export default function sanitizePacientesInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizePacientesInput = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    idRol: req.body.idRol,
    telefono: req.body.telefono,
    direccion: req.body.direccion,
    idLocalidad: req.body.idLocalidad,
    tipoDni: req.body.tipoDni,
    dni: req.body.dni,
  };

  Object.keys(req.body.sanitizePacientesInput).forEach((key) => {
    if (req.body.sanitizePacientesInput[key] === undefined) {
      delete req.body.sanitizePacientesInput[key];
    }
  });

  next();
}
