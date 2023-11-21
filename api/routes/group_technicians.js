const express = require('express')
const router = express.Router()
const groupTechniciansController = require('../controllers/group_technicians')
const auth = require('../middlewares/auth')

// api/group_technicians
router.post('/', auth, groupTechniciansController.createGroupTechnician)
router.delete('/', auth, groupTechniciansController.deleteGroupTechnician)
router.get('/', auth, groupTechniciansController.freeTechnicians)

module.exports = router
