import { Request, Response, NextFunction} from "express"
import { UserRepository } from "./user.repository.js"
import { User } from "./user.entity.js"

const repository = new UserRepository()

function sanitizeUserInput(req: Request, res: Response, next: NextFunction) {

    req.body.sanitizeUserInput = {
        name: req.body.name,
        email: req.body.email,
        pass: req.body.pass,
        birthdate: req.body.birthdate,
    }

    Object.keys(req.body.sanitizeUserInput).forEach(key => {
        if(req.body.sanitizeUserInput[key] === undefined){
        delete req.body.sanitizeUserInput[key]
        }
    })
    next()
}

function findAll(req: Request, res: Response) {
    return res.json({data: repository.findAll() })
}

function findOne (req: Request, res: Response) {
    const id = req.params.id
    const user = repository.findOne({id})
    if(!user){
       return res.status(404).send({ message:"User not found" })
    }
    res.json({data: user})
}

function add(req: Request, res: Response) {
    const input = req.body.sanitizeUserInput

    const userInput = new User (
        input.name, 
        input.email, 
        input.pass, 
        input.birthdate)

    const user = repository.add(userInput)
    return res.status(201).send({ message: "User created", data: user })
}

function update(req: Request, res: Response) {
    req.body.sanitizeUserInput.id = req.params.id
    const user = repository.update(req.body.sanitizeUserInput)

    if(!user){
        return res.status(404).send({ message: "User not found" })
    }

    return res.status(200).send({ message: "User updated succesfully" ,data: user })
}

function remove(req: Request, res: Response) {
    const id = req.params.id
    const user = repository.delete({id})

    if(!user){
        res.status(404).send({ message: "User not found" })
    }else {
    res.status(200).send({ message: "User deleted succesfully" })
    }
}

export {sanitizeUserInput, findAll, findOne, add, update, remove}