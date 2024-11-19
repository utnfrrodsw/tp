import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";
import { Socio } from "../socio/socio.entity.js";
import { NotFoundError } from "@mikro-orm/core";
import { Prestamo } from "./prestamo.entity.js";
import { Ejemplar } from "../ejemplar/ejemplar.entity.js";
import { PoliticaBiblioteca } from "../politicaBiblioteca/politicaBiblioteca.entity.js";
import { LineaPrestamo } from "../lineaPrestamo/lineaPrestamo.entity.js";
import { Sancion } from "../sancion/sancion.entity.js";
import { addDays, differenceInDays, startOfDay } from "date-fns";
import { PoliticaSancion } from "../politicaSancion/politicaSancion.entity.js";
import { error } from "console";

const em = orm.em;

async function retirarLibrosPaso1R(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Se recibe idSocio
  try {
    const socio = await em.findOneOrFail(Socio, req.body.idSocio, {
      populate: ["misSanciones", "misPrestamos"], // Falta .misLpPrestamo
    });

    if (socio.estasInhabilitado()) {
      const noDevueltos = socio.getNoDevueltos();
      return res.status(409).json({
        message: "Socio inhabilitado (no devolvio un prestámo)",
        ejemplares: noDevueltos,
      });
    }
    if (socio.estasSancionado()) {
      const diasSancionado = socio.getDiasSancion();
      return res.status(409).json({
        message: "Socio sancionado",
        diasSancionRestantes: diasSancionado,
      });
    }
    const politicaBiblioteca = await em.findOneOrFail(PoliticaBiblioteca, 1);
    const disponibles =
      politicaBiblioteca.getCantPendientesMaximo() - socio.getCantPendientes();

    return res.status(200).json({
      message: "El socio esta habilitado",
      disponibles: disponibles,
    });
  } catch (error: any) {
    if (error.message.includes("PoliticaBiblioteca")) {
      return res
        .status(500)
        .json({ message: "Politica biblioteca inaccesible" });
    }
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: "Socio no encontrado" });
    }
    next(error);
  }
  // Valida socio y devuelve cantidad disponibles para sacar en prestámo.
}

async function retirarLibrosPaso2R(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    //Se recibe idLibro, idEjemplar, idSocio paso 1(no lo ingresa el usuario).

    const ejemplar = await em.findOneOrFail(
      Ejemplar,
      [req.body.idEjemplar, req.body.idLibro],
      {
        populate: [
          "miLibro",
          "misLp",
          "miLibro.miEditorial",
          "miLibro.misAutores",
        ],
      }
    );
    const libro = ejemplar.getLibro();

    if (ejemplar.estasPendiente()) {
      //No sucede en condiciones normales. El libro se saca de una estanteria.
      return res
        .status(409)
        .json({ message: "El ejemplar no esta disponible para ser prestado." });
    }

    const socio = await em.findOneOrFail(Socio, req.body.idSocio, {
      populate: ["misPrestamos.misLpPrestamo.miEjemplar.miLibro"],
    });

    if (socio.tenesPendiente(libro)) {
      res
        .status(409)
        .json({ message: "El socio tiene pendiente un ejemplar de ese libro" });
    }

    return res.status(200).json({
      data: { ejemplar: ejemplar },
    });
  } catch (error: any) {
    if (error.message.includes("Socio")) {
      return res.status(400).json({ message: "Socio inexistente" }); // Desde aca no hay forma de validar que sea el mismo del paso 1. Pendiente en AD.
    }
    if (error instanceof NotFoundError) {
      return res
        .status(404)
        .json({ message: "Ejemplar o libro no encontrado" });
    }

    next(error);
  }
  //Retorna ejemplar para mostrar datos del libro.
}

interface EjemplarRequest {
  id: number;
  miLibro: number;
}

async function retirarLibrosPaso3R(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    //Se recibe array de CP de ejemplar, e idSocio.

    const ejemplares: EjemplarRequest[] = req.body.ejemplares;
    console.log(ejemplares);
    if (ejemplares.length < 0) {
      // Revisar con Zodd.
      return res.status(400).json({ message: "No se recibió ninguna LP" });
    }
    const ejemplaresUnicos = Array.from(
      new Map(
        ejemplares.map((ejemplar) => [ejemplar.miLibro, ejemplar])
      ).values()
    );
    const ejemplaresEncontrados = await em.find(
      Ejemplar,
      {
        $or: ejemplaresUnicos,
      },
      { populate: ["miLibro", "misLp"] }
    ); // miLibro necesario para validacion extra. De lo contrario no.

    // -------  Validaciones "extra" fuera del contexto del CU de negocio (Cualquier validación fallida es un bad request)

    if (ejemplares.length != ejemplaresEncontrados.length) {
      return res.status(400).json({
        message:
          "Se recibió algún ejemplar inexistente o dos o más ejemplares del mismo libro",
      });
    }
    const socio = await em.findOneOrFail(Socio, req.body.idSocio, {
      populate: ["misPrestamos.misLpPrestamo.miEjemplar.miLibro"],
    }); // Esto se necesita para el camino normal también.

    for (const ejemplar of ejemplaresEncontrados) {
      if (socio.tenesPendiente(ejemplar.getLibro())) {
        return res.status(400).json({
          message: "El socio tiene pendiente un ejemplar de ese libro",
        });
      }
    }
    for (const ejemplar of ejemplaresEncontrados) {
      if (ejemplar.estasPendiente()) {
        //No sucede en condiciones normales. El libro se saca de una estanteria.
        return res.status(400).json({
          message:
            "Existe un ejemplar que no esta disponible para ser prestado.",
        });
      }
    }
    const politicaBiblioteca = await em.findOneOrFail(PoliticaBiblioteca, 1);
    const disponibles =
      politicaBiblioteca.getCantPendientesMaximo() - socio.getCantPendientes();
    if (ejemplaresUnicos.length > disponibles) {
      return res.status(400).json({
        message:
          "Se recibieron más ejemplares de los que el socio puede retirar",
      });
    }

    //-------- Fin validaciones extra ---------

    const prestamo = em.create(Prestamo, {
      miSocioPrestamo: socio,
      fechaPrestamo: new Date(),
      ordenLinea: 0,
    });
    const hoy = new Date();
    const diasPrestamo = politicaBiblioteca.getDiasPrestamo();
    const fechaDevolucionTeorica = addDays(hoy, diasPrestamo);
    for (const ejemplar of ejemplaresEncontrados) {
      const lp = em.create(LineaPrestamo, {
        miEjemplar: ejemplar,
        ordenLinea: prestamo.getOrdenLinea(),
        fechaDevolucionTeorica: fechaDevolucionTeorica,
      });
      prestamo.misLpPrestamo.add(lp);
    }
    await em.flush();

    return res.status(201).json({
      data: {
        prestamoNuevo: prestamo,
      },
    });
  } catch (error: any) {
    if (error.message.includes("PoliticaBiblioteca")) {
      return res
        .status(500)
        .json({ message: "Politica biblioteca  inaccesible" });
    }
    if (error.message.includes("Socio") && error instanceof NotFoundError) {
      return res.status(400).json({ message: "Socio inexistente" });
    }
    next(error);
  }
}

// CU Devolver libro (Se repite por cada libro)

async function devolverLibro(req: Request, res: Response, next: NextFunction) {
  // Se recibe idSocio, idEjemplar e idLibro.

  try {
    const ejemplar = await em.findOneOrFail(
      Ejemplar,
      [req.body.idEjemplar, req.body.idLibro],
      { populate: ["misLp.miPrestamo.misLpPrestamo"] }
    );

    const libro = ejemplar.getLibro();
    const socio = await em.findOneOrFail(Socio, req.body.idSocio);

    if (!ejemplar.estasPendiente()) {
      return res
        .status(400)
        .json({ message: "El ejemplar no esta pendiente de devolución" });
    }

    const hoy = new Date();
    const lpPendiente = ejemplar.getLpPendiente();
    const prestamo = lpPendiente.getPrestamo();

    if (false) {
      // lpPendiente.estasAtrasado()
      let diasSancion = 0;
      const diasAtraso = differenceInDays(
        hoy,
        lpPendiente.getFechaDevolucionTeorica()
      );

      const politicaSancion = await em
        .createQueryBuilder(PoliticaSancion)
        .orderBy({ diasHasta: "ASC" })
        .where({ diasHasta: { $gt: diasAtraso } })
        .getSingleResult();

      if (politicaSancion) {
        // quitar comentario diasSancion = politicaSancion.getDiasSancion();
      }
      if (!politicaSancion) {
        const politicaBiblioteca = await em.findOneOrFail(
          PoliticaBiblioteca,
          1
        );
        diasSancion = politicaBiblioteca.getDiasSancionMaxima();
      }

      em.create(Sancion, {
        diasSancion: diasSancion,
        miSocioSancion: socio,
        fechaSancion: hoy,
      });
      console.log(hoy);
      lpPendiente.setFechaDevolucionReal(hoy);

      // Logica ultima LP
      // A pesar de no hacer em.await() la LP de adentro del prestamo esta sincronizada con la lpPendiente, por eso = 0 y no = 1.
      if (prestamo.getCantPendientes() === 0) {
        prestamo.setFinalizado();
      }
      // Fin logica
      await em.flush();
      return res.status(200).json({
        message: "Devolucion registrada y socio sancionado.",
        data: {
          socio: socio,
          diasSancion: diasSancion,
          ejemplar: ejemplar,
          libro: libro,
        },
      });
    }

    lpPendiente.setFechaDevolucionReal(hoy);

    if (prestamo.getCantPendientes() === 0) {
      prestamo.setFinalizado();
    }
    await em.flush();

    return res.status(200).json({
      message: "Se registro la devolución del libro",
      data: {
        libro: libro,
        ejemplar: ejemplar,
        socio: socio,
      },
    });
  } catch (error: any) {
    if (error.message.includes("PoliticaBiblioteca")) {
      return res
        .status(500)
        .json({ message: "Politica biblioteca  inaccesible" });
    }
    if (error.message.includes("Socio")) {
      return res.status(404).json({ message: "Socio inexistente" }); //Notar que es un 404 porque aca si lo ingresa el usuario
    }
    if (error instanceof NotFoundError) {
      return res
        .status(404)
        .json({ message: "Ejemplar o libro no encontrado" });
    }
    next(error);
  }
}

async function buscarPrestamos(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Nota: Si se envia un valor de parámetro inexistente, devuelve un 200 con el array vacío.
  try {
    const estadoPrestamo = req.query.estadoPrestamo as string | undefined;

    const prestamos = await em.find(
      Prestamo,
      estadoPrestamo ? { estadoPrestamo } : {},
      { populate: ["misLpPrestamo.miEjemplar.miLibro"] }
    );
    res
      .status(200)
      .json({ message: "Los prestámos encontrados son:", data: prestamos });
  } catch (error: any) {
    next(error);
  }
}
async function buscarPrestamosSocio(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    //No se valida el socio apropósito
    const prestamos = await em.find(
      Prestamo,
      { miSocioPrestamo: req.body.idSocio },
      { populate: ["misLpPrestamo.miEjemplar"] }
    );
    res.status(200).json({
      message: "Los prestámos del socio encontrados son:",
      data: prestamos,
    });
  } catch (error: any) {
    next(error);
  }
}
async function buscarPrestamosNoDevueltosSocio(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const socio = await em.findOneOrFail(Socio, req.body.idSocio, {
      populate: [
        "misPrestamos.misLpPrestamo.miEjemplar.miLibro.misAutores",
        "misPrestamos.misLpPrestamo.miEjemplar.miLibro.miEditorial",
      ],
    });
    const noDevueltos = socio.getNoDevueltos();
    res.status(200).json({
      message: "Los ejemplares no devueltos del socio son",
      ejemplares: noDevueltos,
    });
  } catch (error: any) {
    next(error);
  }
}

export {
  retirarLibrosPaso1R,
  retirarLibrosPaso2R,
  retirarLibrosPaso3R,
  devolverLibro,
  buscarPrestamos,
  buscarPrestamosSocio,
  buscarPrestamosNoDevueltosSocio,
  devolverLibroD,
};

/* 
Desacoplamiento del CU - Devolver un Libro
Funcion 1 Buscar Ejemplar | Bad Request EN EL FRONT 
Funcion 2 Buscar Socio | Bad Request EN EL FRONT
Funcion 3 Validar si el ejemplar esta pendiente o que el Buscar Ejemplar además devuelva el estado | Bad Request en el FRONT si no está pendiente


Función 1 Validar que el ejemplar este pendiente y exista. 
Funcion 2 Validar socio exista

Si estas dos salieron bien, modal de confirmación. Si no, error y muestro el porque.

Funcion 4 Mando id prestamo + numero de linea + IDSOCIO para sancionar,
y actualizo fechaDevolucionReal. Aca está la sanción. Que el ORM traiga el prestamo, y en memoria busco la LP.


*/

// Devolver libro desacoplado

async function devolverLibroD(req: Request, res: Response, next: NextFunction) {
  // Se recibe idPrestamo, idLinea e idSocio.

  try {
    const idPrestamo = Number.parseInt(req.params.id);
    const idLP = Number.parseInt(req.params.idLP);
    const idSocio = req.body.idSocio; // Asumo que está bien porque acaba de ser validado en el Front
    const prestamo = await em.findOneOrFail(
      Prestamo,
      { id: idPrestamo },
      { populate: ["misLpPrestamo"] }
    );

    const hoy = new Date();
    const lpPendiente = prestamo.getLinea(idLP);
    if (!lpPendiente) {
      throw new Error("La linea de préstamo seleccionada no existe");
    }
    // Poner true aca para testear camino alternativo
    if (lpPendiente.estasAtrasado()) {
      let diasSancion = 0;
      const diasAtraso = differenceInDays(
        hoy,
        lpPendiente.getFechaDevolucionTeorica()
      );

      const politicaSancion = await em
        .createQueryBuilder(PoliticaSancion)
        .orderBy({ diasHasta: "ASC" })
        .where({ diasHasta: { $gt: diasAtraso } })
        .getSingleResult();

      if (politicaSancion) {
        diasSancion = politicaSancion.getDiasSancion();
      }
      if (!politicaSancion) {
        const politicaBiblioteca = await em.findOneOrFail(
          PoliticaBiblioteca,
          1
        );
        diasSancion = politicaBiblioteca.getDiasSancionMaxima();
      }

      em.create(Sancion, {
        diasSancion: diasSancion,
        miSocioSancion: idSocio,
        fechaSancion: hoy,
      });

      lpPendiente.setFechaDevolucionReal(hoy);

      // Logica ultima LP
      // A pesar de no hacer em.await() la LP de adentro del prestamo esta sincronizada con la lpPendiente, por eso = 0 y no = 1.
      if (prestamo.getCantPendientes() === 0) {
        prestamo.setFinalizado();
      }
      // Fin logica

      // diasSancion = 10; Hardcodear esto para testear camino alternativo.
      await em.flush();
      return res.status(200).json({
        message: "Devolucion registrada y socio sancionado.",
        data: {
          socio: idSocio,
          diasSancion: diasSancion,
        },
      });
    }
    // Comentar de aca hasta antes del catch para testear camino alternativo.
    lpPendiente.setFechaDevolucionReal(hoy);

    if (prestamo.getCantPendientes() === 0) {
      prestamo.setFinalizado();
    }
    await em.flush();

    return res.status(200).json({
      message: "Se registro la devolución del libro",
      data: {
        socio: idSocio,
      },
    });
  } catch (error: any) {
    if (error.message.includes("PoliticaBiblioteca")) {
      return res
        .status(500)
        .json({ message: "Politica biblioteca  inaccesible" });
    }
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: "Préstamo no encontrado" });
    }
    if (error.message.includes("La linea de préstamo seleccionada no existe")) {
      return res
        .status(404)
        .json({ message: "Línea de Préstamo no encontrada" });
    }
    next(error);
  }
}
