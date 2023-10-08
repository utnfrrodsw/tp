import { Request, Response, NextFunction } from "express"
import { EditorialRepository } from "./Editorial.repository.js"
import { Editorial } from "./Editorial.js"

const  repository = new EditorialRepository()

async function sanitizeInput(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput = {
        name: req.body.name,
        categoria: req.body.categoria,
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
    const editorial = await repository.findOne({id})
    if(!editorial) {
        return res.status(404).send({ message: "no funciona"})
    }
    return res.json({data:editorial})
}


async function add(req: Request , res: Response){
    //console.log(req.body.sanitizedInput)
    const input = req.body.sanitizedInput

    const editorialInput = new Editorial(
        input.name,
        input.categoria,
        input.id
        )

    const editorial = await repository.add(editorialInput)
    
    res.status(201).send({message: '...', data: editorial})
}

async function update(req: Request , res: Response){
    
    
    const editorial = await repository.update(req.params.id, req.body.sanitizedInput)
 
    if(!editorial){
        return res.status(404).send({ message: "no funciona"})
    }

    return res.status(200).send({message: '...', data: editorial})
}


async function remove(req: Request , res: Response){
    const id = req.params.id

    const editorial = await repository.delete({id})

    if(!editorial){
        res.status(404).send({ message: "no funciona"})  
    }
    res.status(204).send({message: 'Borrado'})
    
}


export { sanitizeInput, findAll, findOne, add, update, remove }