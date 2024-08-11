import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { PoliticaSancion } from "./politicaSancion.entity.js";

function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  req.body.inputOK = {
    diasHasta: req.body.diasHasta,
    diasSancion: req.body.diasSancion,
  };

  Object.keys(req.body.inputOK).forEach((key) => {
    if (req.body.inputOK[key] === undefined) {
      delete req.body.inputOK[key];
    }
  });

  next();
}

const em = orm.em;

async function buscarPoliticasSancion(req: Request, res: Response) {
  try {
    const politicas = await em.find(PoliticaSancion, {});
    res.status(200).json({
      message: "Las politicas de sanción encontradas son: ",
      data: politicas,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function buscarPoliticaSancion(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const politica = await em.findOneOrFail(PoliticaSancion, id);
    res.status(200).json({ message: "Politica encontrada", data: politica });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function altaPoliticaSancion(req: Request, res: Response) {
  try {
    const politica = em.create(PoliticaSancion, req.body.inputOK); //No se valida que diasHasta > diasDesde
    await em.flush();
    res
      .status(201)
      .json({ message: "Politica de sanción creada", data: politica });
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).json({
        message:
          "Ya existe una politica de sanción con esa cantidad de dias hasta",
      });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function actualizarPoliticaSancion(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const politica = em.getReference(PoliticaSancion, id);
    em.assign(politica, req.body.inputOK);
    await em.flush();
    res.status(200).json({ message: "Politica de sanción actualizada" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function bajaPoliticaSancion(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const politica = em.getReference(PoliticaSancion, id);
    await em.removeAndFlush(politica);
    res.status(200).json({ message: "Libro eliminado" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export {
  sanitizeInput,
  buscarPoliticasSancion,
  buscarPoliticaSancion,
  altaPoliticaSancion,
  actualizarPoliticaSancion,
  bajaPoliticaSancion,
};
