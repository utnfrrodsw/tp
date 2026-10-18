import type { NewPaymentTypeDto, ModifyPaymentTypeDto, PaymentTypeQueryDto } from "./paymentType.schema.js";
import type { Request, Response, NextFunction } from "express";
import type { PaymentTypeService } from "./paymentType.service.js";
import type { IdDto } from "@/shared/common.schema.js";
import { emitEvent } from "@/websocket.js";
import { EVENTS } from "@/shared/events.js";
import { error } from "node:console";

export class PaymentTypeController {
    constructor(private service: PaymentTypeService) { }

    public newTypePayment = async (req: Request, res: Response, next: NextFunction) => {
        const data = req.validated.body as NewPaymentTypeDto;

        try {
            const newTypePayment = await this.service.create(data)
            emitEvent(EVENTS.paymentTypeChanged, newTypePayment);
            res.status(201).json(newTypePayment);
        } catch (error) {
            next(error);
        }
    };

    public getAllPaymentTypes = async (req: Request, res: Response, next: NextFunction) => {
        const query = req.validated.query as PaymentTypeQueryDto;

        try {
            res.json(await this.service.findAll(query));
        } catch (_error) {
            next(error)
        }
    };


    public deleteTypePayment = async (req: Request, res: Response, next: NextFunction) => {

        const params = req.validated.params as IdDto;

        try {
            await this.service.delete(params.id);
            emitEvent(EVENTS.paymentTypeDeleted, { id: params.id });
            return res.status(200).json({ message: 'Type tailure deleted successfully' });
        } catch (error) {
            next(error)
        }
    };

    public modifyTypePayment = async (req: Request, res: Response, next: NextFunction) => {
        const data = req.validated.body as ModifyPaymentTypeDto;
        const params = req.validated.params as IdDto

        try {
            const updatedTypePayment = await this.service.update(params.id, data)
            emitEvent(EVENTS.paymentTypeChanged, updatedTypePayment);
            res.json(updatedTypePayment);
        } catch (error) {
            next(error);
        }
    };

    public getOneTypePayment = async (req: Request, res: Response, next: NextFunction) => {
        const params = req.validated.params as IdDto;

        try {
            res.json(await this.service.findById(params.id));
        } catch (error) {
            next(error);
        }
    };

}
