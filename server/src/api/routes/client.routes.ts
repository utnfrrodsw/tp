import { Router } from "express";
import { createCategoryClient, deleteCategoryClient, getAllCategoryClients, getPartialCategoryClients, modifyCategoryClient} from "./../../controllers/categoryClientController.js"


const router = Router();

router.post('/createCategoryClient', createCategoryClient);

router.get('/getAllCategoryClients', getAllCategoryClients);

router.get('/getPartialCategoryClients/:description', getPartialCategoryClients);

router.delete('/deleteCategoryClient/:id', deleteCategoryClient);

router.put('/modifyCategoryClient/:id', modifyCategoryClient);



export default router;