import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { PoliticaBiblioteca } from "./politicaBiblioteca.entity.js";

function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  req.body.inputOK = {
    diasSancionMaxima: req.body.diasSancionMaxima,
    diasPrestamo: req.body.diasPrestamo,
    cantPendientesMaximo: req.body.cantPendientesMaximo,
  };

  Object.keys(req.body.inputOK).forEach((key) => {
    if (req.body.inputOK[key] === undefined) {
      delete req.body.inputOK[key];
    }
  });

  next();
}

const em = orm.em;

async function buscarPoliticaBiblioteca(req: Request, res: Response) {
  try {
    const politica = await em.findOneOrFail(PoliticaBiblioteca, {
      id: 1,
    });
    res.status(200).json({
      message: "La politica de biblioteca actual es: ",
      data: politica,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function altaPoliticaBiblioteca(req: Request, res: Response) {
  //Funcion para desarrollo, migrar en producción.
  try {
    const politica = em.create(PoliticaBiblioteca, req.body.inputOK);

    await em.flush();
    res
      .status(201)
      .json({ message: "Politica de biblioteca creada", data: politica });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function actualizarPoliticaBiblioteca(req: Request, res: Response) {
  try {
    const politica = em.getReference(PoliticaBiblioteca, 1);
    em.assign(politica, req.body.inputOK);
    await em.flush();
    res.status(200).json({ message: "Politica de biblioteca actualizada" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function bajaPoliticaBiblioteca(req: Request, res: Response) {
  //Funcion para desarollo.
  res.status(500).json({ message: "Not implemented" });
}
export {
  sanitizeInput,
  buscarPoliticaBiblioteca,
  altaPoliticaBiblioteca,
  actualizarPoliticaBiblioteca,
  bajaPoliticaBiblioteca,
};
