import { Request, Response } from "express";
import prisma from "../database/prisma.js";

export const getAllCategoryClients = async (req: Request, res: Response) => {
  try {
    const clients = await prisma.category_Client.findMany();
    res.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCategoryClient = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.category_Client.delete({
      where: { id_category_client: Number(id) }
    });
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getPartialCategoryClients = async (req: Request, res: Response) => {
  try {
    const result = await prisma.category_Client.findMany({
      where: {
        categoryClientName: {
          contains: req.params.description as string,           
        }
      }
    });

    if (result.length === 0) return res.status(404).json([]);
    res.json(result);
  } catch (error) {
    console.error("Error fetching partial clients:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const createCategoryClient = async (req: Request, res:Response) => {
  try{
      const { categoryClientName, amountForCategoryUp} = req.body;
      const newCategoryClient = await prisma.category_Client.create({
        data: {
          categoryClientName,
          amountForCategoryUp
        }
      })
      return res.status(201).json(newCategoryClient);
  }catch(error){
    console.error('Error en el createCategoryClient', error)
      return res.status(500).json({message:"Error interno del servidor"})
  }
}
export const modifyCategoryClient = async (req: Request, res: Response) => {
  const data: any = {};
  if(req.body.categoryClientName) data.categoryClientName = req.body.categoryClientName;
  if(req.body.amountForCategoryUp) data.amountForCategoryUp = req.body.amountForCategoryUp;
  try {
    const updatedCategoryClient = await prisma.category_Client.update({
      where: { id_category_client: Number(req.params.id) },
      data: data
    });
    res.json(updatedCategoryClient);
  } catch (error) {
    console.error("Error updating category client:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
