import type { NextFunction, Request, Response } from "express";
import type { IdDto } from "@/shared/common.schema.js";
import type { RegisterPaymentDto, PaymentQueryDto } from "./payment.schema.js";
import type { PaymentService } from "./payment.service.js";

export class PaymentController {
    constructor(private service: PaymentService) { }

    public registerPayment = async (req: Request, res: Response, next: NextFunction) => {
        const data = req.validated.body as RegisterPaymentDto;

        try {
            const payment = await this.service.create(data);
            return res.status(201).json(payment);
        } catch (error) {
            next(error);
        }
    };

    public getAllPayments = async (req: Request, res: Response, next: NextFunction) => {
        const query = req.validated.query as PaymentQueryDto;

        try {
            res.json(await this.service.findAll(query));
        } catch (error) {
            next(error);
        }
    };

    public getOnePayment = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.validated.params as IdDto;

        try {
            const payment = await this.service.findById(id);

            if (!payment) {
                return res.status(404).json({ message: "Pago no encontrado" });
            }

            return res.json(payment);
        } catch (error) {
            next(error);
        }
    };

    public getPaymentsOfBudget = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.validated.params as IdDto;

        try {
            const payments = await this.service.findByBudgetId(id);
            return res.json(payments);
        } catch (error) {
            next(error);
        }
    };

    public deletePayment = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.validated.params as IdDto;

        try {
            const result = await this.service.delete(id);
            return res.json(result);
        } catch (error) {
            next(error);
        }
    };
}
