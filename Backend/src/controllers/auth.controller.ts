import User from "../models/user.model.js"
import bcrypjs from "bcryptjs"
import { Request, RequestHandler, Response } from "express"
import jwt from "jsonwebtoken"

export const register = async(req : Request,res: Response) => {
    const {email, password, username} = req.body


    try{
        //hashear la contraseña 
         const passwordHash = await bcrypjs.hash(password, 10)


        const newUser = new User({
            username,
            email,
            password: passwordHash,
        })

        const userSave =  await newUser.save()
        
        //crear token del usuario
        jwt.sign(
            {
                id: userSave._id
            },
            "secret123",
            {
                expiresIn: "1d"
            },
            (err: any,token: any) => {
                if(err) console.log(err);
                res.json({token})
            }
        )
    
       console.log({
            id: userSave._id,
            username: userSave.username,
            email: userSave.email
       });

    
        res.send("Registrado") 
    }catch(err){
        console.log(err);
    }

}

export const login = (req: Request,res: Response) => res.send("Login")