const { Router } = require('express')
const noteController = require('../controllers/noteController')
const authMiddlewares = require('../middlewares/authMiddlewares')
const { noteContent, noteTitle, validationResult } = require('../middlewares/validatorMiddlewares')
const checkAdmin = require('../middlewares/checkAdminMiddleware')



const route = Router()

route.post('/',[authMiddlewares.checkIfTokenExists, authMiddlewares.decodeToken, noteTitle, noteContent, validationResult],noteController.createNote)
route.get('/:id',[authMiddlewares.checkIfTokenExists, authMiddlewares.decodeToken],noteController.getNote)
route.delete('/:id', [authMiddlewares.checkIfTokenExists, authMiddlewares.decodeToken],noteController.deleteNote)
route.get('/',[authMiddlewares.checkIfTokenExists, authMiddlewares.decodeToken, checkAdmin],noteController.getAllNotesGroupedByUser)

module.exports = route