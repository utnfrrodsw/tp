const express = require('express')
const router = express.Router()
const techniciansController = require('../controllers/technicians')
const auth = require('../middlewares/auth')

// api/technicians
router.get('/', techniciansController.getTechnicians)
router.get('/:id', techniciansController.getTechnician)
router.put('/:id', auth, techniciansController.updateTechnician)
router.post('/', auth, techniciansController.createTechnician)
router.delete('/:id', auth, techniciansController.deleteTechnician)

module.exports = router
