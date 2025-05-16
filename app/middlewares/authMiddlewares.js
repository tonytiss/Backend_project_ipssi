const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const path = require('path')
dotenv.config({
    path: path.join(__dirname, '../../.env')
})

const authMiddlewares = {

    checkIfTokenExists(req, res, next) {
        try {
            const { authorization } = req.headers
    
            if (!authorization) {
                return res.status(401).json({ message: "No authorization header" })
            }
    
            const token = authorization.split(" ")[1]
    
            if (!token) {
                return res.status(401).json({ message: "No token provided" })
            }
    
            req.token = token
    
            next()
        } catch (err) {
            
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    },

    decodeToken(req, res, next) {
        const { token } = req
    
        if (!token) {
            return res.status(401).json({ message: "Token manquant" })
        }
    
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
            
            req.decodedToken = decodedToken
    
            next()
        } catch (err) {
            return res.status(401).json({ message: "Token invalide ou expiré : Veuillez-vous reconnecter" })
        }
    }
    
}

module.exports = authMiddlewares