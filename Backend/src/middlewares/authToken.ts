import { verifyToken } from "../lib/generateToken";
import { Request, Response, NextFunction } from "express";

export interface IPayload {
    id: number;
    iat: number;
}

// Extender la interfaz Request para incluir la propiedad id
export interface CustomRequest extends Request {
    id?: number;
    user?: IPayload
}

export const checkAuthToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const token: any = req.header("token");

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const tokenData = await verifyToken(token) as IPayload;
        console.log(tokenData);

        
        if (!tokenData || !tokenData.id) {
            return res.status(401).json({ message: 'Invalid token data' });
        }

        req.user = tokenData;  
        next();

    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: 'Error credentials' });
    }
};