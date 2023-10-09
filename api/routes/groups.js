const express = require('express')
const router = express.Router()
const groupsController = require('../controllers/groups')
const auth = require('../middlewares/auth')

// api/groups
router.get('/', groupsController.getGroups)
router.get('/:id', groupsController.getGroup)
router.put('/:id', auth, groupsController.updateGroup)
router.post('/:id', auth, groupsController.createGroup)
router.delete('/:id', auth, groupsController.deleteGroup)

module.exports = router
