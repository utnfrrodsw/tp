import { Request, Response, NextFunction } from "express";
import { Admin } from "./admin.entity.js";
import { orm } from "../shared/db/orm.js";
import bcrypt from 'bcrypt'

const em = orm.em

function sanitizarAdminInput(req: Request, res: Response, next: NextFunction){

    req.body.sanitizarAdm = {

        nombre: req.body.nombre,
        contraseña: req.body.contraseña,
        apellido: req.body.apellido,
        mail: req.body.mail,
        fecha_nacimiento: req.body.fecha_nacimiento,
        id: req.body.id,
        torneos: req.body.torneos

    }

    //Acá irían las validaciones de datos...

    Object.keys(req.body.sanitizarAdm).forEach(key =>{
        if(req.body.sanitizarAdm[key]===undefined){
            delete req.body.sanitizarAdm[key]
    }})
    next()
}

async function findAll(req: Request,res: Response){
    try{
        const admins = await em.find(Admin, {}, {populate: ['torneos']})
        res.status(200).json({message: 'found all admins', data: admins})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

async function findOne(req: Request,res: Response){
    try{
        const id = Number.parseInt(req.params.id)
        const admin = await em.findOneOrFail(Admin, {id},{populate: ['torneos']})
        res.status(200).json({message: 'found admin', data: admin})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

async function registroAdmin(req: Request,res: Response){
    const { mail } = req.body
    const user = await em.findOne(Admin, {mail})
    
    if(!user){
        const admin = await em.create(Admin, req.body)
        admin.contraseña = await bcrypt.hash(admin.contraseña, 10)
        await em.flush();
        return res.status(201).json({ message: 'Admin registrado exitosamente' })
    }
    return res.status(500).json({ message: 'Ya existe un admin con ese mail asociado' })
}

async function update(req: Request,res: Response){
    try{
        const id = Number.parseInt(req.params.id)
        const admin = await em.findOneOrFail(Admin, id)
        em.assign(admin, req.body)
        await em.flush()
        res.status(200).json({message: 'admin updated', data: admin})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

async function remove(req: Request,res: Response){
    try{
        const id = Number.parseInt(req.params.id)
        const admin = em.getReference(Admin, id)
        await em.removeAndFlush(admin)
        res.status(200).json({message: 'admin removed'})
    }catch (error: any){
        res.status(500).json({message: error.message})
    }
}

export {sanitizarAdminInput, findAll, findOne, registroAdmin, update, remove}