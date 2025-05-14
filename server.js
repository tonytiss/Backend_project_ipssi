const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const cors = require('cors')
const { dbConnectionTest } = require('./app/database/dbConnect')
const userRoutes = require('./app/routes/userRoutes')

dotenv.config({
    path: path.join(__dirname, '.env')
})

dbConnectionTest()

const app = express()


app.use(express.urlencoded())
app.use(express.json())
app.use(cors())
app.use('/api/v1/user', userRoutes)

/* function rootCallback(req, res){

    return res.status(200).json({ message : "Welcome"})
}


app.get('/', rootCallback ) */



app.listen(3000, function(){

    console.log('🚀 Server running on port 3000')

})
