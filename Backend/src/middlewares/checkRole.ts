import { verifyToken } from "../lib/generateToken";
import { Request, Response, NextFunction } from "express";
import { User } from "../User/user.entity";

export interface IPayload {
    id: string;
    iat: number;
}

export interface CustomRequest extends Request {
    id?: number;
}

export const checkRoleAuth = (roles: string | string[]) => async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const token: any = req.header("token");
        if (!token) {
            return res.status(401).json({ error: "Token is required" });
        }

        const tokenData = await verifyToken(token) as IPayload;
        const userData = await User.findOneBy({ id: parseInt(tokenData.id) });

        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }

        const allowedRoles = Array.isArray(roles) ? roles : [roles];

        if (allowedRoles.includes(userData.rol)) {
            next();
        } else {
            res.status(403).json({ error: "You don't have rol" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}