const { Router } = require('express')
const noteController = require('../controllers/noteController')
const authMiddlewares = require('../middlewares/authMiddlewares')
const { noteContent, noteTitle, validationResult } = require('../middlewares/validatorMiddlewares')




const route = Router()

route.post('/',[authMiddlewares.checkIfTokenExists, authMiddlewares.decodeToken, noteTitle, noteContent, validationResult],noteController.createNote)
route.get('/:email',[authMiddlewares.checkIfTokenExists, authMiddlewares.decodeToken],noteController.getNote)
route.delete('/:id', [authMiddlewares.checkIfTokenExists, authMiddlewares.decodeToken],noteController.deleteNote)

module.exports = route