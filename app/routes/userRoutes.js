const { Router} = require('express')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const route = Router()

route.post('/', userController.store)
route.delete('/:id', userController.destroy)
route.post('/login', authController.login)

module.exports = route