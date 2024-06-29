import { Request, Response } from "express";
import { MedicoService } from "./medicos.service.js";

const service = new MedicoService();

export async function findAll (req: Request, res: Response): Promise<Response> {
    try {
        const medicos = await service.findAll();
    
        return res.status(200).json({
            message: "Medicos encontrados.",
            error: false,
            data: medicos,
        });

      } catch (error: any) {

        return res.status(500).json({
            message: error.message,
            error: true,
            data: null,
        });
      }
}

export async function findOne (req: Request, res: Response): Promise<Response> {

    try{
        const medico = await service.findOne({ id: req.params.id });

        return res.status(200).json({
            message: "Medico encontrado.",
            error: false,
            data: medico,
        });

    } catch(error: any) {

        return res.status(500).json({
            message: error.message,
            error: true,
            data: null,
          });
    }
}

export async function add (req: Request, res: Response): Promise<Response> {
    try {

        const medico = await service.add({ ...req.body.sanitizedInput });
  
        return res.status(200).json({
            message: "Medico creado.",
            error: false,
            data: medico,
      });

    } catch (error: any) {

        return res.status(500).json({
            message: error.message,
            error: true,
            data: null,
      });
    }
  }

export async function update (req: Request, res: Response): Promise<Response> {
    try {

        const medicoActualizar = await service.update({
            id: req.params.id,
            ...req.body.sanitizedInput,
        });
  
        return res.status(200).json({
            message: "Medico actualizado.",
            error: false,
            data: medicoActualizar,
        });

    } catch (error: any) {
            
        return res.status(500).json({
            message: error.message,
            error: true,
            data: null,
      });
    
    }
  }
  

export async function remove (req: Request, res: Response): Promise<Response> {
    try {

        const medicoABorrar = await service.remove({ id: req.params.id });
    
        return res.status(200).json({
            message: "Medico borrado.",
            error: false,
            data: medicoABorrar,
        });

    } catch (error: any) {

        return res.status(500).json({
            message: error.message,
            error: true,
            data: null,
        });
        
    }
  }
  
  

