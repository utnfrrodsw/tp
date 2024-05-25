import { Request, Response } from "express";
import { PacienteRepository } from "./pacientes.repository.js";
import { NotFound, Repeated } from "../../../shared/errors.js";

const repository = new PacienteRepository();

export function findAll(req: Request, res: Response): Response {
  try {
    const listaPacientes = repository.findAll();

    return res.status(200).json({
      message: "Pacientes encontrados.",
      error: false,
      data: listaPacientes,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      error: true,
      data: null,
    });
  }
}

export function findOne(req: Request, res: Response): Response {
  try {
    const pacienteEncontrado = repository.findOne({ id: req.params.id });

    return res.status(200).json({
      message: "Paciente encontrado.",
      error: false,
      data: pacienteEncontrado,
    });
  } catch (error: any) {
    if (error instanceof NotFound) {
      return res.status(400).json({
        message: error.message,
        error: true,
        data: null,
      });
    }

    return res.status(500).json({
      message: error.message,
      error: true,
      data: null,
    });
  }
}

export function add(req: Request, res: Response): Response {
  try {
    const pacienteAInsertar = repository.add({
      ...req.body.sanitizePacientesInput,
    });

    return res.status(200).json({
      message: "Paciente creado correctamente.",
      error: false,
      data: pacienteAInsertar,
    });
  } catch (error: any) {
    if (error instanceof Repeated) {
      return res.status(400).json({
        message: error.message,
        error: true,
        data: null,
      });
    }

    return res.status(200).json({
      message: error.message,
      error: true,
      data: null,
    });
  }
}

export function update(req: Request, res: Response): Response {
  try {
    const pacienteAActualizar = repository.update({
      id: req.params.id,
      ...req.body.sanitizePacientesInput,
    });

    return res.status(200).json({
      message: "Paciente actualizado correctamente.",
      error: false,
      data: pacienteAActualizar,
    });
  } catch (error: any) {
    if (error instanceof Repeated || error instanceof NotFound) {
      return res.status(400).json({
        message: error.message,
        error: true,
        data: null,
      });
    }

    return res.status(200).json({
      message: error.message,
      error: true,
      data: null,
    });
  }
}

export function remove(req: Request, res: Response): Response {
  try {
    const pacienteABorrar = repository.remove({ id: req.params.id });

    return res.status(200).json({
      message: "Paciente borrado correctamente.",
      error: false,
      data: pacienteABorrar,
    });
  } catch (error: any) {
    if (error instanceof NotFound) {
      return res.status(400).json({
        message: error.message,
        error: true,
        data: null,
      });
    }

    return res.status(200).json({
      message: error.message,
      error: true,
      data: null,
    });
  }
}
