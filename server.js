const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const { dbConnectionTest, sequelizeClient } = require('./app/database/dbConnect')
const userRoutes = require('./app/routes/userRoutes')
const notesRoutes = require('./app/routes/notesRoutes')

dotenv.config({
  path: path.join(__dirname, '.env')
});

const app = express()

app.use(express.urlencoded({ extended: true, limit: '100kb' }));
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

async function startServer() {
  try {
    // 1. Test connexion DB
    await dbConnectionTest()

    // 2. Synchronisation des modèles (tables)
    await sequelizeClient.sync({ alter: true })
    console.log('✅ Tables synchronisées avec la base de données')

    // 3. Démarrage du serveur Express
    app.listen(3000, () => {
      console.log('🚀 Server running on port 3000')
    });

  } catch (err) {
    console.error('❌ Erreur au démarrage du serveur :', err)
    process.exit(1) // Arrêt si problème critique
  }
}

startServer()


/* function rootCallback(req, res){

    return res.status(200).json({ message : "Welcome"})
}


app.get('/', rootCallback ) */




