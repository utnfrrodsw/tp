const express = require('express')
const router = express.Router()
const techniciansGroupController = require('../controllers/group_technicians')
// const auth = require('../middlewares/auth')

// api/group_technicians
// router.get('/', techniciansGroupController.getGroupTechnicians)
// router.get('/:id', techniciansGroupController.getGroupTechnician)
// router.put('/:id', techniciansGroupController.updateGroupTechnician)
router.post('/', techniciansGroupController.createGroupTechnician)
router.delete('/', techniciansGroupController.deleteGroupTechnician)
router.get('/', techniciansGroupController.freeTechnicians)

module.exports = router
