import type { NextFunction, Request, Response } from 'express';
import { $Enums } from "@/database/prisma.js";
import type { IdDto } from "@/shared/common.schema.js";
import type { RegisterOrderDto, OrderQueryDto } from './order.schema.js';
import type { OrderService } from './order.service.js';

export class OrderController {
  constructor(private service: OrderService) {}

  public registerOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const data = req.validated.body as RegisterOrderDto;

    try {
      const newOrder = await this.service.create({
        ...data,
        status: $Enums.EnumOrderStatus.recibido,
        dateOfEntry: new Date(),
        estimatedDate: data.estimatedDate
          ? new Date(data.estimatedDate)
          : undefined,
        equipmentPhotoUrl: data.equipmentPhotoUrl ?? undefined,
      });
      return res.status(201).json({
        message: 'Orden registrada con éxito',
        order: newOrder,
      });
    } catch (error) {
      next(error);
    }
  };

  public getOneOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { id } = req.validated.params as IdDto;

    try {
      res.json(await this.service.findById(id));
    } catch (error) {
      next(error);
    }
  };

  // Cubre tanto el listado general como la búsqueda parcial: OrderQueryDto
  // trae "search" y el repository lo aplica con `contains` sobre
  // observations. No hace falta un endpoint /search aparte (mismo criterio
  // que se usó en equipment.controller.ts).
  public getAllOrders = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const query = req.validated.query as OrderQueryDto;

    try {
      res.json(await this.service.findAll(query));
    } catch (error) {
      next(error);
    }
  };

  public getOrderOfEquipment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { id } = req.validated.params as IdDto;

    try {
      const orders = await this.service.findByEquipmentId(id);
      return res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  };

  // Métricas para las tarjetas del Home: cuenta órdenes por estado.
  // Delega en el service -> repository (misma arquitectura de capas que
  // el resto del módulo), en vez de pegarle a prisma desde el controller.
  public getStats = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      res.status(200).json(await this.service.getStats());
    } catch (error) {
      next(error);
    }
  };

  public deleteOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { id } = req.validated.params as IdDto;

    try {
      const result = await this.service.delete(id);
      return res.status(200).json({
        message: 'Orden dada de baja con éxito',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };
}
