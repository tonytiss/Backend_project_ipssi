const  User  = require('../database/models/User')
const jwt = require('jsonwebtoken')
const argon2 = require('argon2')
const dotenv = require('dotenv')
const path = require('path')
dotenv.config({
    path: path.join(__dirname, '../../.env')
})

const authController = {

    async login(req,res) {

        const { email, password } = req.body

        try{
            const user = await User.findOne({
                where:{ email }
            })

            const isPasswordValid = await argon2.verify(user.password, password)
            if(!isPasswordValid){
                return res.status(401).json({ message: "Invalid credentials"})
            }
            const token = jwt.sign({ email, role: user.role }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            })
            return res.status(200).json({ token })

        } catch(err){
            console.trace(err)
            return res.status(500).json({ err })

        }
    }
}

module.exports = authController