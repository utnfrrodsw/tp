import { Router } from 'express'

import { getPartialTypes, createTypeFail, getAllTypes, deleteType, modifyType} from '../../controllers/failController.js'

const router = Router();

router.get('/getPartialTypes/:query', getPartialTypes);

router.post('/createTypeFail', createTypeFail);

router.get('/getAllTypes', getAllTypes);

router.delete('/deleteType/:id', deleteType);

router.put('/modifyType/:id_failure_type', modifyType);

export default router;