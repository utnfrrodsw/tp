import { Router }  from "express";
import { createTypePayment, deleteTypePayment, getAllPaymentTypes, getPartialTypesPayment, modifyTypePayment } from "../../controllers/paymentControllers.js";
    

const route = Router();

route.get('/getAllPaymentTypes', getAllPaymentTypes);

route.post('/createTypePayment', createTypePayment);

route.get('/getPartialTypesPayment/:query', getPartialTypesPayment);

route.delete('/deleteTypePayment/:id', deleteTypePayment);

route.put('/modifyTypePayment/:id', modifyTypePayment);

export default route;
