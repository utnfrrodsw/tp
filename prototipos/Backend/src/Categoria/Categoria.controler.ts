import { Request, Response, NextFunction } from "express"
import { CategoriaRepository } from "./Categoria.repository.js"
import { Categoria } from "./Categoria.js"

const  repository = new CategoriaRepository()

async function sanitizeInput(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput = {
        id: req.body.id,
        descripcion: req.body.descripcion,

    }
    Object.keys(req.body.sanitizedInput).forEach(key =>{
        if(req.body.sanitizedInput[key] === undefined){
            delete req.body.sanitizedInput[key]
        }
    })
    next()
}

async function findAll(req: Request,res: Response ){
    res.json({data: await repository.findAll()})
}


async function findOne(req: Request, res: Response){
    const id = req.params.id
    const categoria = await repository.findOne({id})
    if(!categoria) {
        return res.status(404).send({ message: "no funciona"})
    }
    return res.json({data:categoria})
}


async function add(req: Request , res: Response){
    //console.log(req.body.sanitizedInput)
    const input = req.body.sanitizedInput

    const categoriaInput = new Categoria(
        input.id,
        input.descripcion,
        
        )

    const categoria = await repository.add(categoriaInput)
    
    res.status(201).send({message: '...', data: categoria})
}

async function update(req: Request , res: Response){
    
    const categoria = await repository.update(req.params.id,req.body.sanitizedInput)
 
    if(!categoria){
        return res.status(404).send({ message: "no funciona"})
    }

    return res.status(200).send({message: '...', data: categoria})
}


async function remove(req: Request , res: Response){
    const id = req.params.id

    const categoria = await repository.delete({id})

    if(!categoria){
        res.status(404).send({ message: "no funciona"})  
    }
    res.status(204).send({message: 'Borrado'})
    
}


export { sanitizeInput, findAll, findOne, add, update, remove }