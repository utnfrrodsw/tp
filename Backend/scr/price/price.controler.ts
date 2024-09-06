import { Request, Response, NextFunction } from 'express';
/*import { PriceRepository } from './price.repository.js';
import { Price } from './price.entity.js';*/

/*const pricerepository = new PriceRepository();*/

function sanitizePriceInput(req: Request, res: Response, next:NextFunction){
  
  req.body.sanitizedprice = {
    amount: req.body.amount,
    date: req.body.date,
    id_product: req.body.id_product,
    id: req.body.id,
  }
   Object.keys(req.body.sanitizePriceInput).forEach((key) => {
    if (req.body.sanitizePriceInput[key] === undefined) {
      delete req.body.sanitizePriceInput[key]
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

export { findAll, findOne, add, update, remove, sanitizePriceInput }


/*
function findAll(req: Request,res: Response ){
  res.json({data: pricerepository.findAll()});
}


function findOne(req: Request,res: Response ){
  const id = req.params.id;
  const price = pricerepository.findOne({id});
  if(!price){
    return res.status(404).send({message:'ID non-existent' })
  }
  res.json(price)
}


function add (req: Request,res: Response){
  const input = req.body.sanitizedprice

  const peopleInput = new Price (input.amount,input.date,input.id_product,input.id)
  const price = pricerepository.add(peopleInput)
  return res.status(201).send({message: 'new price create', data: Price })
}


function update (req: Request,res: Response ){
  req.body.sanitizedprice.id = req.params.id
  const price = pricerepository.update('1', req.body.sanitizedprice) 
  if (!price) {
    return res.status(404).send({message:'price not found' })
  }
  return res.status(200).send({message: 'price changed suscessfully', data:  Price })

}

function remove(req: Request,res: Response ){
  const id = req.params.id;
  const price = pricerepository.delete({id})
  if(!price){
    return res.status(404).send({message:'incorrect ID' })
  }
  else{
  return res.status(200).send({message: 'price deleted suscessfully' })
  }
}

export {  sanitizePriceInput, findOne, add, update, remove, findAll }*/