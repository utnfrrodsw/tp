const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users')
const auth = require('../middlewares/auth')

// api/usuarios
router.get('/', auth, usersController.getUsers)
router.get('/:id', auth, usersController.getUser)
router.put('/:id', auth, usersController.updateUser)

module.exports = router
