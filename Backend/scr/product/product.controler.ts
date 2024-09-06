import { Request, Response, NextFunction } from 'express';
/*import { Product } from './product.entity.js';*/
/*import { productRepository } from './product.repository.js';


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

async function findAll( req: Request, res: Response ){
  res.status(500).json({message: 'Not implemented'});
}

async function findOne( req: Request, res: Response ){
  res.status(500).json({message: 'Not implemented'});
}

async function add( req: Request, res: Response ){
  res.status(500).json({message: 'Not implemented'});
}

async function update( req: Request, res: Response ){
  res.status(500).json({message: 'Not implemented'});
}

async function remove( req: Request, res: Response ){
  res.status(500).json({message: 'Not implemented'});
}

export { findAll, findOne, add, update, remove, sanitizeproductInput }

*/