const User = require('../database/models/User')



const userController = {

    async store(req, res){

        const { firstName, lastName, email, password } = req.body

        try {
            const user = User.build({ firstName, lastName, email, password })
            await user.save()

            return res.status(201).json({ user })

        } catch(err){
            console.trace(err)
            return res.status(500).json({err})

        }

    },
    async delete(req, res) {
        const { id } = req.params
    
        try {
          const user = await User.findByPk(id)
    
          if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' })
          }
    
          await user.destroy()
          return res.status(200).json({ message: 'Utilisateur supprimé avec succès' })
        } catch (err) {
          console.trace(err)
          return res.status(500).json({ err })
        }
    },
    async getOneByEmail(req, res) {

      const {decodedToken} = req

      if(!decodedToken){
          return res.status(401).json({ message: "no no decoded token"})
      }
      const { email } = decodedToken

      try {

        const user = await User.findOne({
          where: {
            email: email
          }
        })

        if(!user){
          return res.status(404).json({ message: "no user found by email"}
          )
        }
        return res.status(200).json({ user })
      } catch{
          return res.status(500).json[{err}]
      }
    }
}


module.exports = userController