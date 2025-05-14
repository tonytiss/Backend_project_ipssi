const { Router} = require('express')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const authMiddlewares = require('../middlewares/authMiddlewares')
const route = Router()

route.post('/', userController.store)
route.delete('/:id', userController.delete)
route.post('/login', authController.login)
route.get('/me', [ authMiddlewares.checkIfTokenExists, authMiddlewares.decodeToken ], userController.getOneByEmail)

module.exports = route