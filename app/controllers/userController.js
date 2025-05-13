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
    async destroy(req, res) {
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
      }
}


module.exports = userController