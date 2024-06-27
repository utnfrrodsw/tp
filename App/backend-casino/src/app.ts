import express, { NextFunction } from 'express'
import { Request, Response,  } from 'express';
import { Payment } from '../classes/payments.js';

const app = express();
app.use(express.json())

const payments= [
    new Payment(
        'Bitcoin',
        'BTC',
        0.000016,
        'btc'
    )
]

function sanitizePaymentInput(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedPayment = {
        name: req.body.name,
        abv: req.body.abv,
        conv: req.body.conv,
        id: req.body.id
    }
    //Mas validaciones

    next()
}

app.get('/api/payment', (req,res) => {
    res.json(payments)
})

app.get('/api/payment/:id', (req,res) =>{
    const payment = payments.find((Payment) => Payment.id === req.params.id)
    if(!payment){
        res.status(404).send({message:'Payment type not found'})
    }
    res.json(payment)
})

app.post('/api/payment', sanitizePaymentInput, (req,res) => {
    const input =  req.body.sanitizedPayment

    const payment = new Payment(
        input.name,
        input.abv,
        input.conv,
        input.id
    );

    payments.push(payment)
    res.status(201).send({message: 'Payment type succesfully added!'})
})

app.put('/api/payment/:id', sanitizePaymentInput, (req,res) =>{
    const paymentIdx = payments.findIndex((Payment) => Payment.id === req.params.id)

    if(paymentIdx === -1){
        res.status(404).send({ message: 'Payment type not found'})
    }
    
    payments[paymentIdx]= { ...payments[paymentIdx], ...req.body.sanitizedPayment }

    res.status(200).send({ message: 'Payment type successfully edited!', data: payments[paymentIdx] })
})

app.delete('/api/payment/:id', (req,res) => {
    const paymentIdx = payments.findIndex((Payment) => Payment.id === req.params.id)

    if(paymentIdx === -1){
        res.status(404).send({ message: 'Payment type not found'})
    }
    payments.splice(paymentIdx, 1)
    res.status(200).send({ message: 'Payment type successfully deleted!'})
})

app.listen(3000, ()=>{
    console.log("Server running on http://localhost:3000/")
})