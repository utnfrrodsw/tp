import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { Socio } from "../socio/socio.entity.js";
import { NotFoundError } from "@mikro-orm/core";
import { Prestamo } from "./prestamo.entity.js";
import { Ejemplar } from "../ejemplar/ejemplar.entity.js";
import { PoliticaBiblioteca } from "../politicaBiblioteca/politicaBiblioteca.entity.js";
import { LineaPrestamo } from "../lineaPrestamo/lineaPrestamo.entity.js";
import { differenceInDays } from "date-fns";
import { PoliticaSancion } from "../politicaSancion/politicaSancion.entity.js";
import { Sancion } from "../sancion/sancion.entity.js";

import {
  classToPlain,
  plainToClass,
  instanceToPlain,
  serialize,
} from "class-transformer";
import { Libro } from "../libro/libro.entity.js";

function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  req.body.inputOK = {};

  Object.keys(req.body.inputOK).forEach((key) => {
    if (req.body.inputOK[key] === undefined) {
      delete req.body.inputOK[key];
    }
  });

  next();
}

const em = orm.em;

async function retirarLibrosPaso1(req: Request, res: Response) {
  // Se recibe idSocio
  try {
    const socio = await em.findOneOrFail(Socio, req.body.idSocio, {
      populate: ["misSanciones", "misPrestamos.misLpPrestamo.miEjemplar"],
    });

    if (!socio.estasHabilitado()) {
      //Revisar si calcularlo o actualización automatica.
      return res
        .status(409)
        .json({ message: "Socio inhabilitado (no devolvio un prestámo)" });
    }
    if (socio.estasSancionado()) {
      //Este es un cálculo
      const diasSancionado = socio.getDiasSancion();
      return res
        .status(409)
        .json({ message: "Socio sancionado", data: diasSancionado });
    }

    const prestamoVacio = em.create(Prestamo, {
      fechaPrestamo: new Date(),
      ordenLinea: 0,
      miSocioPrestamo: socio,
    });

    /* const prestamoJson = instanceToPlain(prestamoVacio, {
      enableCircularCheck: true,
      excludeExtraneousValues: true,
    });
    console.log(prestamoJson);
*/
    const prestamoJson = prestamoVacio.toJSON(false);
    const socioJson = socio.toJSON(true);

    return res.status(200).json({
      prestamoActual: { ...prestamoJson, miSocioPrestamo: socioJson },
    });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: "Socio no encontrado" });
    }
    return res.status(500).json({ message: error.message });
  }
}

async function retirarLibrosPaso2(req: Request, res: Response) {
  try {
    //Se recibe idLibro, idEjemplar, socio del paso 1, prestamo del paso 1.

    const ejemplar = await em.findOneOrFail(
      Ejemplar,
      [req.body.idEjemplar, req.body.idLibro],
      {
        populate: ["miLibro"],
      }
    );
    const libro = ejemplar.getLibro();
    const politicaBiblioteca = await em.findOneOrFail(PoliticaBiblioteca, 1);

    const prestamoActual = plainToClass(Prestamo, req.body.prestamoActual);

    if (
      politicaBiblioteca.getCantPendientesMaximo() ===
      prestamoActual.miSocioPrestamo.getCantPendientes() // Crear un getSocio
    ) {
      res.status(409).json({
        message: "El socio ya saco la cantidad maxima de libros en prestámo",
      });
    }
    if (prestamoActual.miSocioPrestamo.tenesPendiente(ejemplar.getLibro())) {
      res
        .status(409)
        .json({ message: "El socio tiene pendiente un ejemplar de ese libro" });
    }
    if (prestamoActual.tenesPendiente(libro)) {
      //Se reutiliza el metodo.
      res.status(409).json({
        message: "Ya existe un ejemplar de ese libro en el prestámo actual",
      });
    }
    const fechaDevolucionTeorica = new Date("2024-08-15"); //Falta el calculo
    const lpNueva = em.create(LineaPrestamo, {
      ordenLinea: prestamoActual.getOrdenLinea(),
      fechaDevolucionTeorica: fechaDevolucionTeorica,
      miEjemplar: ejemplar,
    });

    prestamoActual.misLpPrestamo.add(lpNueva);

    const prestamoJson = prestamoActual.toJSON(false);
    const socioJson = prestamoActual.miSocioPrestamo.toJSON(true);
    return res.status(200).json({
      data: {
        prestamoActual: { ...prestamoJson, miSocioPrestamo: socioJson },
      },
    });
  } catch (error: any) {
    if (error.message.includes("PoliticaBiblioteca")) {
      return res
        .status(500)
        .json({ message: "Politica biblioteca  inaccesible" });
    }
    if (error instanceof NotFoundError) {
      return res
        .status(404)
        .json({ message: "Ejemplar o libro no encontrado" });
    }

    return res.status(500).json({ message: error.message });
  }
}

async function retirarLibrosPaso3(req: Request, res: Response) {
  try {
    const prestamo = plainToClass(Prestamo, req.body.prestamoActual);
    //Falta validar que este completo
    await em.persistAndFlush(prestamo);
    res.status(201).json({ message: "Prestámo creado" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
export { retirarLibrosPaso1, retirarLibrosPaso2 };
/*
 // CU Devolver libro (Se repite por cada libro)

 async function devolverLibroPaso1(req: Request, res: Response){
  try{
  const  idEjemplar = Number.parseInt(req.body.idEjemplar);
  const  idLibro = Number.parseInt(req.body.idLibro);
  const ejemplar = await em.findOneOrFail(Ejemplar,[idEjemplar,idLibro]);
  const libro = ejemplar.getLibro();
  
  if(!ejemplar.estasPendiente()){
    res.status(400).json({message: "El ejemplar no esta pendiente de devolución"})
  }
  const lpPendiente = ejemplar.getLpPendiente();
  if(!lpPendiente.seDevolvioATiempo()){
    const hoy = new Date();
    let diasSancion = 0;
    const diasAtraso = differenceInDays(hoy,lpPendiente.getFechaDevolucionTeorica());
    const politicaSancion = await em.createQueryBuilder(PoliticaSancion,'p').select(['*']).where({diasHasta: {$lt:'diasAtraso'}}).getSingleResult(); //Esta mal, pero iria aca.
    if(!politicaSancion){
      const politicaBiblioteca = await em.findOneOrFail(PoliticaBiblioteca,1);
      diasSancion = politicaBiblioteca.getDiasSancionMaxima();
    }
    if(politicaSancion){
      diasSancion = politicaSancion.getDiasSancion();
    }
    const socio = //obtener socio
    const sancion  = em.create(Sancion,{diasSancion:diasSancion,miSocio:socio,fechaSancion:hoy});
    await em.flush();
    const libro = ejemplar.getLibro();
    res.status(200).json({message: "Devolucion registrada y socio sancionado.",data:{socio:socio,diasSancion:diasSancion}})
    // FALTA 
  }
  const hoy = new Date();
  lpPendiente.setFechaDevolucionReal(hoy);
  await em.persistAndFlush(lpPendiente);
  const socio = //socio; 
  res.status(200).json({message: "Se registro la devolución del libro", data: {fechaDevolucion : hoy, libro:libro, ejemplar:ejemplar, socio: socio}})
  }catch(error:any){
    if(error instanceof NotFoundError){
      res.status(404).json({message: "Ejemplar o libro no encontrado"});
    }
  res.status(500).json({message: error.message});
  }



 }^*/
