import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'

async function validateToken(req: Request, res: Response, next: NextFunction){
    const headerToken = req.headers['authorization']
    
    if(headerToken != undefined){
        try{
            jwt.verify(headerToken, process.env.SECRET_KEY || 'pepitos123')
            next()
        }catch (error){
            res.status(401).json({message: 'Token no válido'})
        }
        
    }else{
        res.status(500).json({message: 'Acceso Denegado'})
    }
}

export {validateToken}