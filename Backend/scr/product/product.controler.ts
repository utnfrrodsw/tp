import { Request, Response, NextFunction } from 'express';
import { Product } from './product.entity.js';
import { productRepository } from './product.repository.js';


const productrepository = new productRepository();

function sanitizeproductInput(req: Request, res: Response, next:NextFunction){
  
  req.body.sanitizedproduct = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    stock: req.body.stock
  }

  Object.keys(req.body.sanitizedproduct).forEach((key) => {
    if (req.body.sanitizedproduct[key] === undefined) {
      delete req.body.sanitizedproduct[key]
    }
  })

  next()
}
function findAll(req: Request, res: Response ){
  res.json({data: productrepository.findAll()});
}

function findOne(req: Request,res: Response ){
  const id = req.params.id;
  const product = productrepository.findOne({id});
  if(!product){
    return res.status(404).send({message:'ID incorrecto, no existe ninguna product con ese ID' })
  }
  res.json(product)
}

function add (req: Request,res: Response ){
  const input = req.body.sanitizedproduct

  const productsInput = new Product (input.total,input.cantidad,input.fechaproduct,input.id)
  const product = productrepository.add(productsInput)
  return res.status(201).send({message: 'new product create', data: Product })
}

function update(req: Request,res: Response ){
  req.body.sanitizedproduct.id = req.params.id
  const product = productrepository.update('1', req.body.sanitizedproduct) 
  if (!product) {
    return res.status(404).send({message:'product not found' })
  }
  return res.status(200).send({message: 'product modificada correctamente', data:  Product })
}


function remove(req: Request,res: Response ){
  const id = req.params.id;
  const product = productrepository.delete({id})
  if(!product){
    return res.status(404).send({message:'ID incorrecto, no existe ninguna product con ese ID' })
  }
  else{
  return res.status(200).send({message: 'product eliminada correctamente'})
}}



export { findAll, sanitizeproductInput, findOne, add, update, remove }









