import { Request, Response } from "express";
import { PacienteService } from "./pacientes.service.js";

const service = new PacienteService();

export async function findAll(req: Request, res: Response): Promise<Response> {
  try {
    const pacientes = await service.findAll();

    return res.status(200).json({
      message: "Pacientes encontrados.",
      error: false,
      data: pacientes,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      error: true,
      data: null,
    });
  }
}

export async function findOne(req: Request, res: Response): Promise<Response> {
  try {
    const paciente = await service.findOne({ id: req.params.id });
    // console.log(paciente)
    
    

    
    
    return res.status(200).json({
      message: "Paciente encontrado.",
      error: false,
      data: paciente,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
      error: true,
      data: null,
    });
  }
}

export async function add(req: Request, res: Response): Promise<Response> {
  try {
    const paciente = await service.add({ ...req.body.sanitizedInput });

    return res.status(200).json({
      message: "Paciente creado.",
      error: false,
      data: paciente,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      error: true,
      data: null,
    });
  }
}

export async function update(req: Request, res: Response): Promise<Response> {
  try {
    const pacienteAActualizar = await service.update({
      id: req.params.id,
      ...req.body.sanitizedInput,
    });

    return res.status(200).json({
      message: "Paciente actualizado",
      error: false,
      data: pacienteAActualizar,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      error: true,
      data: null,
    });
  }
}

export async function remove(req: Request, res: Response): Promise<Response> {
  try {
    const pacienteABorrar = await service.remove({ id: req.params.id });

    return res.status(200).json({
      message: "Paciente borrado.",
      error: false,
      data: pacienteABorrar,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      error: true,
      data: null,
    });
  }
}
