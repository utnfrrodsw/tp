const express = require('express')
const router = express.Router()
const tasksController = require('../controllers/tasks')
const auth = require('../middlewares/auth')

// api/tasks
router.get('/', tasksController.getTasks)
router.get('/sum-tasks', tasksController.sumTasks)
router.get('/:id', tasksController.getTask)
router.put('/:id', auth, tasksController.updateTask)
router.post('/', auth, tasksController.createTask)
router.delete('/:id', auth, tasksController.deleteTask)

module.exports = router
