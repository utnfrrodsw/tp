import type { NextFunction, Request, Response } from 'express';
import type { RegisterEquipmentDto, EquipmentQueryDto, ModifyEquipmentDto } from './equipment.schema.js';
import type { IdDto } from "@/shared/common.schema.js";
import type { EquipmentService } from './equipment.service.js';

export class EquipmentController {
  constructor(private service: EquipmentService) { }

  public registerEquipment = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.validated.body as RegisterEquipmentDto;

    try {
      const newEquipment = await this.service.create(data);
      return res.status(201).json(newEquipment);

    } catch (error) {
      next(error);
    }
  };

  public getOneEquipment = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.validated.params as IdDto;

    try {
      res.json(await this.service.findById(id));
    } catch (error) {
      next(error);
    }
  };

  // getAllEquipment ya cubre la búsqueda parcial: EquipmentQueryDto trae
  // "search" y el repository lo aplica con `contains` sobre brand/model/
  // observations. No hace falta un endpoint aparte para eso.
  public getAllEquipment = async (req: Request, res: Response, next: NextFunction) => {
    const query = req.validated.query as EquipmentQueryDto;

    try {
      res.json(await this.service.findAll(query));
    } catch (error) {
      next(error);
    }
  };

  // NOTA: requiere que EquipmentService tenga un método findByClientId
  // (ver snippet aparte para el repository y el service).
  public getEquipmentOfClient = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.validated.params as IdDto;

    try {
      const equipments = await this.service.findByClientId(id);
      return res.status(200).json(equipments);
    } catch (error) {
      next(error);
    }
  };

  public modifyEquipment = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.validated.params as IdDto;
    const data = req.validated.body as ModifyEquipmentDto;

    try {
      const updated = await this.service.update(id, data);

      if (!updated) {
        return res.status(404).json({ message: "Equipo no encontrado" });
      }

      return res.json(updated);
    } catch (error) {
      next(error);
    }
  };

  public deleteEquipment = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.validated.params as IdDto;

    try {
      const deleted = await this.service.delete(id);

      if (!deleted) {
        return res.status(404).json({ message: "Equipo no encontrado" });
      }

      return res.status(200).json(deleted);
    } catch (error) {
      if ((error as { code?: string })?.code === 'P2003') {
        return res.status(409).json({
          message: "No se puede eliminar el equipo porque tiene órdenes o fallas asociadas.",
        });
      }
      next(error);
    }
  };
}