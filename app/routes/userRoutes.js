const { Router} = require('express')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const authMiddlewares = require('../middlewares/authMiddlewares')
const validatorMiddlewares = require('../middlewares/validatorMiddlewares')
const { loginLimiterByEmail } = require('../middlewares/limiterMiddleware')
const checkAdmin = require('../middlewares/checkAdminMiddleware')

const route = Router()

route.post('/', [validatorMiddlewares.emailcreate, validatorMiddlewares.password, validatorMiddlewares.validationResult], userController.store)
route.delete('/:id', [authMiddlewares.checkIfTokenExists, authMiddlewares.decodeToken], userController.delete)
route.post('/login', [validatorMiddlewares.email, validatorMiddlewares.validationResult, loginLimiterByEmail], authController.login)
route.get('/me', [authMiddlewares.checkIfTokenExists, authMiddlewares.decodeToken], userController.getOneByEmail)
route.get('/index', [authMiddlewares.checkIfTokenExists, authMiddlewares.decodeToken], checkAdmin, userController.index)
route.patch('/:id',[authMiddlewares.checkIfTokenExists, authMiddlewares.decodeToken, validatorMiddlewares.emailcreate, validatorMiddlewares.password,validatorMiddlewares.validationResult],userController.update)
route.patch('/promoteadmin/:id',[authMiddlewares.checkIfTokenExists, authMiddlewares.decodeToken], checkAdmin, userController.updateRoleToAdmin)
module.exports = route