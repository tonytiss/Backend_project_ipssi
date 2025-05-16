const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const { dbConnectionTest } = require('./app/database/dbConnect')
const userRoutes = require('./app/routes/userRoutes')
const notesRoutes = require('./app/routes/notesRoutes')

dotenv.config({
    path: path.join(__dirname, '.env')
})

dbConnectionTest()

const app = express()


app.use(express.urlencoded({ extended: true, limit: '100kb' }))
app.use(express.json())

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      console.error('❌ Mauvais JSON reçu :', err.message)
      return res.status(400).json({ message: "Requête JSON invalide. Vérifie le format du corps." })
    }
    next(err)
  })






app.use('/api/v1/user', userRoutes)
app.use('/api/v1/notes', notesRoutes)

/* function rootCallback(req, res){

    return res.status(200).json({ message : "Welcome"})
}


app.get('/', rootCallback ) */



app.listen(3000, function(){

    console.log('🚀 Server running on port 3000')

})
