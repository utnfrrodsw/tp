import type { NextFunction, Request, Response } from "express";
import type { IdDto } from "@/shared/common.schema.js";
import type { RegisterBudgetDto, ModifyBudgetDto, BudgetQueryDto } from "./budget.schema.js";
import type { BudgetService } from "./budget.service.js";
import { enviarPdfPorMail } from '@/service/mail.service.js'; 
import {assertBudgetWithRelations} from "@/pdf/renderBudgetPdf.js"
import jwt from 'jsonwebtoken';
import { config } from "@/utils/config.js";
import { verifyBudgetToken, type BudgetTokenPayload } from "@/utils/budgetToken.js";
import { DECISION_TO_STATUS, isDecision } from "./budget.schema.js";
import { emitEvent } from "@/websocket.js";
import { EVENTS } from "@/shared/events.js";


export class BudgetController {
    constructor(private service: BudgetService) { }

    public registerBudget = async (req: Request, res: Response, next: NextFunction) => {
        const data = req.validated.body as RegisterBudgetDto;

        if (!req.user) {
            return res.status(401).json({ message: "No autenticado" });
        }

        try {
            const budget = await this.service.create({
                id_order: data.id_order,
                laborCost: data.laborCost,
                discount: data.discount,
                id_user: req.user.id,
            });
        emitEvent(EVENTS.budgetChanged, budget);
            return res.status(201).json(budget);
        } catch (error) {
            next(error);
        }
    };

    public getAllBudgets = async (req: Request, res: Response, next: NextFunction) => {
        const query = req.validated.query as BudgetQueryDto;

        try {
            res.json(await this.service.findAll(query));
        } catch (error) {
            next(error);
        }
    };

    public getOneBudget = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.validated.params as IdDto;

        try {
            const budget = await this.service.findById(id);

            if (!budget) {
                return res.status(404).json({ message: "Presupuesto no encontrado" });
            }

            return res.json(budget);
        } catch (error) {
            next(error);
        }
    };

    public getBudgetOfOrder = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.validated.params as IdDto;

        try {
            const budget = await this.service.findByOrderId(id);

            if (!budget) {
                return res.status(404).json({ message: "Esta orden no tiene presupuesto" });
            }

            return res.json(budget);
        } catch (error) {
            next(error);
        }
    };

    public modifyBudget = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.validated.params as IdDto;
        const data = req.validated.body as ModifyBudgetDto;
        try {
            const budget = await this.service.update(id, data);
            emitEvent(EVENTS.budgetChanged, budget);
            return res.json(budget);
        } catch (error) {
            next(error);
        }
    };

    public deleteBudget = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.validated.params as IdDto;

        try {
            const result = await this.service.delete(id);
            emitEvent(EVENTS.budgetDeleted, { id });
            return res.json(result);
        } catch (error) {
            next(error);
        }
    };
    public sendBudgetEmail = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.validated.params as IdDto;

        try {
            const budget = await this.service.findById(id);

            if (!budget) {
                return res.status(404).json({ message: "Presupuesto no encontrado." });
            }

            assertBudgetWithRelations(budget); 

            const tokenVerificacionPres = jwt.sign(
                { nroBudget: budget.nroBudget, id_budget: budget.id_budget },
                config.JWT_SECRET,
                { expiresIn: '48h' }
            );

            await enviarPdfPorMail(budget, tokenVerificacionPres);

            return res.status(200).json({ message: "Presupuesto enviado por mail correctamente." });
        } catch (error) {
            next(error);
        }
    };
    public handleResponse = async (req: Request, res: Response, next: NextFunction) => {
        const {token} = req.params;
        const { decision, client_suggestion } = req.body;
        if (typeof token !== 'string') {
            return res.status(400).json({ error: 'Token no proporcionado o inválido' });
        }
        if (!isDecision(decision)) {
            return res.status(400).json({ error: 'Decisión inválida' });
        }
        const suggestion = typeof client_suggestion === 'string' ? client_suggestion.trim() : '';
        if (decision === 'suggestion' && !suggestion) {
        return res.status(400).json({ error: 'Falta la sugerencia' });
        };
        let payload: BudgetTokenPayload;
        try {
            payload = verifyBudgetToken(token);
        } catch {
            return res.status(401).json({ error: 'Token inválido o expirado' });
        }
        
        try{
            await this.service.respondToBudget(payload.id_budget, {
            status: DECISION_TO_STATUS[decision],
            client_suggestion: decision === 'suggestion' ? suggestion : null,
            });
            emitEvent(EVENTS.budgetChanged, { id_budget: payload.id_budget, decision, client_suggestion: suggestion });
            return res.json({ ok: true });
        }catch(error){
            next(error);
        };
    };
    public getBudgetByToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let payload: BudgetTokenPayload;
            try {
            payload = verifyBudgetToken(String(req.params.token));
            } catch {
            return res.status(401).json({ error: 'Token inválido o expirado' });
            }
            const budget = await this.service.findById(payload.id_budget);
            return res.json(budget);
        } catch (error) {
            next(error);
        }
    };
    public modifyBudgetTech = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.validated.params as IdDto;
        const data = req.validated.body as ModifyBudgetDto;

        try{
            const budget = await this.service.modifyBudget(id, data);
            return res.json(budget);
        }catch(error){
            next(error);
        }
    };
}
