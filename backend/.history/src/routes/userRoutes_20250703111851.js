const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');

// Registro y login (público)
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Perfil usuario (autenticado)
router.put('/:id',authenticate,  userController.updateUser);
router.delete('/:id', authenticate, userController.deleteUser);

// Obtener usuarios (solo admin)
router.get('/', authenticate, isAdmin, userController.getAllUsers);
router.get('/:id',authenticate, isAdmin, userController.getUserById);



router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile);



module.exports = router;
