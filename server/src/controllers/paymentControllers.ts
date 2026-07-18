import { Request, Response } from "express";
import prisma from "../database/prisma.js";

export const createTypePayment = async (req: Request, res: Response) => {
    try{
        const { paymentTypeName, paymentMethod, type_of_payment, percentaje } = req.body;
        const newTypePayment = await prisma.payment_Type.create({
            data: {
                paymentTypeName,
                paymentMethod,
                type_of_payment,
                percentaje
            }
        });
        res.status(201).json(newTypePayment);
    }catch(error){
        res.status(500).json({ error: "Error al crear el tipo de pago" });
    }
};
export const getAllPaymentTypes = async (req: Request, res: Response) => {
    try {
        const result = await prisma.payment_Type.findMany();
        res.status(200).json(result);
    }catch(error){
        res.status(500).json({ error: "Error al obtener los tipos de pago" });
    }
};
export const getPartialTypesPayment = async (req: Request, res: Response) => {
    try {
        const query = String(req.params.query);
        const result = await prisma.payment_Type.findMany({
            where: {
                paymentTypeName: {
                    contains: query,
                }
            }
        });
        res.status(200).json(result);
    }catch(error){
        res.status(500).json({ error: "Error al obtener los tipos de pago" });
    }
};
export const deleteTypePayment = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const deletedTypePayment = await prisma.payment_Type.delete({
            where: { id_payment_type: id }
        });
        res.status(200).json(deletedTypePayment);
    }catch(error){
        res.status(500).json({ error: "Error al eliminar el tipo de pago" });
    }
};
export const modifyTypePayment = async (req: Request, res: Response) => {
    const data: any = {};
    if(req.body.paymentTypeName) data.paymentTypeName = req.body.paymentTypeName;
    if(req.body.paymentMethod) data.paymentMethod = req.body.paymentMethod;
    if(req.body.type_of_payment) data.type_of_payment = req.body.type_of_payment;
    if(req.body.percentaje) data.percentaje = req.body.percentaje;
    try {
        const id = Number(req.params.id);
        const updatedTypePayment = await prisma.payment_Type.update({
            where: { id_payment_type: id },
            data: data
        });
        res.status(200).json(updatedTypePayment);
    } catch (error) {
        res.status(500).json({ error: "Error al modificar el tipo de pago" });
    }
};