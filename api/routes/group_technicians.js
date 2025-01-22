const express = require('express')
const router = express.Router()
const groupTechniciansController = require('../controllers/group_technicians')
const auth = require('../middlewares/auth')

// api/group_technicians
router.post('/', auth, groupTechniciansController.createGroupTechnician)
router.put('/', auth, groupTechniciansController.deleteGroupTechnician)
router.get('/', auth, groupTechniciansController.freeTechnicians)
router.get('/bussyGroups', auth, groupTechniciansController.bussyGroups)
router.get('/:groupId', auth, groupTechniciansController.getTechnicians)

module.exports = router
