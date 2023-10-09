const express = require('express')
const router = express.Router()
const techniciansController = require('../controllers/technicians')
// const auth = require('../middlewares/auth')

// api/technicians
router.get('/', techniciansController.getTechnicians)
router.get('/:id', techniciansController.getTechnician)
router.put('/:id', techniciansController.updateTechnician)
router.post('/', techniciansController.createTechnician)
router.delete('/:id', techniciansController.deleteTechnician)

module.exports = router
