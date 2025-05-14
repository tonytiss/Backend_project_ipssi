const { Router} = require('express')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const authMiddlewares = require('../middlewares/authMiddlewares')
const validatorMiddlewares = require('../middlewares/validatorMiddlewares')

const route = Router()

route.post('/', [validatorMiddlewares.emailcreate, validatorMiddlewares.password, validatorMiddlewares.validationResult], userController.store)
route.delete('/:id', [authMiddlewares.checkIfTokenExists, authMiddlewares.decodeToken], userController.delete)
route.post('/login', [validatorMiddlewares.email, validatorMiddlewares.validationResult], authController.login)
route.get('/me', [authMiddlewares.checkIfTokenExists, authMiddlewares.decodeToken], userController.getOneByEmail)
route.get('/index', userController.index)


module.exports = route