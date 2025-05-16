const { Sequelize } = require('sequelize')
const dotenv = require('dotenv')
const path = require('path')


dotenv.config({
    path: path.join(__dirname, '../../.env')
})

// Lecture du certificat depuis la variable d'environnement
const sslCa = process.env.DB_SSL_CA_BASE64
  ? Buffer.from(process.env.DB_SSL_CA_BASE64, 'base64').toString('utf-8')
  : null

  const sequelizeClient = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT,
      dialectOptions: sslCa
        ? {
            ssl: {
              require: true,
              ca: sslCa,
            },
          }
        : {},
    }
  )



  async function dbConnectionTest(){

    try {

        await sequelizeClient.authenticate()
        console.log('✅ DB Connection succeed')

    } catch (err) {
        console.trace(err)
        console.log('❌ Connection erreur')
    }

  }


module.exports = {
    dbConnectionTest,
    sequelizeClient
}


