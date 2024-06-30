import { Request, Response } from "express";
import { EspecialidadesService } from "./especialidades.service.js";

const service = new EspecialidadesService();



export async function findAll (req: Request, res: Response): Promise<Response> {
    try {
        const especialidades = await service.findAll();
    
        return res.status(200).json({
            message: "especialidades encontradas.",
            error: false,
            data: especialidades,
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
        const especialidad = await service.findOne({ id: req.params.id });

        return res.status(200).json({
            message: "especialidad encontrada.",
            error: false,
            data: especialidad,
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
        console.log(req.body.sanitizedInput)
        const especialidad = await service.add({ ...req.body.sanitizedInput });
  
        return res.status(200).json({
            message: "especialidad creada.",
            error: false,
            data: especialidad,
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

        const especialidadActualizar = await service.update({
            id: req.params.id,
            ...req.body.sanitizedInput,
        });
  
        return res.status(200).json({
            message: "especialidad actualizada.",
            error: false,
            data: especialidadActualizar,
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

        const especialidadABorrar = await service.remove({ id: req.params.id });
    
        return res.status(200).json({
            message: "especialidad borrada.",
            error: false,
            data: especialidadABorrar,
        });

    } catch (error: any) {

        return res.status(500).json({
            message: error.message,
            error: true,
            data: null,
        });
        
    }
  }
  
  
