import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { Socio } from "./socio.entity.js";

function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  req.body.inputOK = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    email: req.body.email,
    domicilio: req.body.domicilio,
    telefono: req.body.telefono,
  };

  Object.keys(req.body.inputOK).forEach((key) => {
    if (req.body.inputOK[key] === undefined) {
      delete req.body.inputOK[key];
    }
  });

  next();
}

const em = orm.em;

async function buscarSocios(req: Request, res: Response) {
  try {
    const socios = await em.find(Socio, {}, { populate: ["misPrestamos"] });
    res.status(200).json({
      message: "Socios encontrados: ",
      data: socios,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function buscarSocio(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const socio = await em.findOneOrFail(Socio, { id });
    res.status(200).json({
      message: "Socio encontrado: ",
      data: socio,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function altaSocio(req: Request, res: Response) {
  try {
    const socioCreado = em.create(Socio, req.body.inputOK);
    await em.flush();
    res.status(201).json({ message: "Socio creado", data: socioCreado });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function actualizarSocio(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const socio = em.getReference(Socio, id);
    em.assign(socio, req.body.inputOK);
    await em.flush();
    res.status(200).json({ message: "Socio actualizado" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function bajaSocio(req: Request, res: Response) {
  res.status(500).json({
    message:
      "No implementado hasta realizar CRUDS de prestamo, lineaPrestamo y sancion",
  });
}
export {
  sanitizeInput,
  buscarSocios,
  buscarSocio,
  altaSocio,
  actualizarSocio,
  bajaSocio,
};
