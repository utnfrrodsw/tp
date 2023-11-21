const express = require('express')
const router = express.Router()
const groupTasksController = require('../controllers/group_tasks')
const auth = require('../middlewares/auth')

// api/group_tasks
router.get('/', groupTasksController.getGroupTasks)
router.post('/', groupTasksController.queryGroupTask)

module.exports = router
