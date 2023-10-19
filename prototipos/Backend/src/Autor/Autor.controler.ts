import { Request, Response, NextFunction } from "express"
import { AutorRepository } from "./Autor.repository.js"
import { Autor } from "./Autor.js"

const  repository = new AutorRepository()

async function sanitizeInput(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput = {

        nombre: req.body.nombre,
        apellido: req.body.apellido,
        id: req.body.id,
        
    }
    Object.keys(req.body.sanitizedInput).forEach(key =>{
        if(req.body.sanitizedInput[key] === undefined){
            delete req.body.sanitizedInput[key]
        }
    })
    next()
}

async function findAll(req: Request,res: Response ){
    res.json({data:await repository.findAll()})
}


async function findOne(req: Request, res: Response){
    const id = req.params.id
    const autor = await repository.findOne({id})
    if(!autor) {
        return res.status(404).send({ message: "no funciona"})
    }
    return res.json({data:autor})
}


async function add(req: Request , res: Response){
    //console.log(req.body.sanitizedInput)
    const input = req.body.sanitizedInput

    const autorInput = new Autor(

        input.nombre,
        input.apellido,
        input.id,
        
        )

    const autor = await repository.add(autorInput)
    
    res.status(201).send({message: '...', data: autor})
}

async function update(req: Request , res: Response){
    
    
    const autor = await repository.update(req.params.id, req.body.sanitizedInput)
 
    if(!autor){
        return res.status(404).send({ message: "no funciona"})
    }

    return res.status(200).send({message: '...', data: autor})
}


async function remove(req: Request , res: Response){
    const id = req.params.id

    const autor = await repository.delete({id})

    if(!autor){
        res.status(404).send({ message: "no funciona"})  
    }
    res.status(204).send({message: 'Borrado'})
    
}


export { sanitizeInput, findAll, findOne, add, update, remove }