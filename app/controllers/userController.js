const User = require('../database/models/User')



const userController = {

    async index(req, res){
      try{
        const users = await User.findAll()
        return res.status(200).json({ users})

      } catch (err) {
          return res.status(500).json({ err })
      }
    },

    async store(req, res) {

      const { firstName, lastName, email, password } = req.body;

      try {
          
          const existingUser = await User.findOne({ where: { email } });

          if (existingUser) {
              return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
          }

          
          const user = await User.create({ firstName, lastName, email, password });

          return res.status(201).json({ user });

      } catch (err) {
          console.trace(err);

          // 2x findOne peuvent passer en meme temps, le create ne passera pas, erreur sequelize gérée ici
          if (err.name === 'SequelizeUniqueConstraintError') {
              return res.status(400).json({ message: 'Cet email existe déjà.' });
          }

          return res.status(500).json({ error: 'Une erreur est survenue.' });
      }
    },
    async delete(req, res) {
        const  {email, role} = req.decodedToken
        console.log ( email, role)
        const { id } = req.params
    
        try {
          const user = await User.findByPk(Number(id))
    
          if (!user) {
            return res.status(404).json({ error: ` id ${id} Utilisateur non trouvé` })
          }
          if (!(email == user.email || role == 'admin')) {
            console.log(user.email)
            return res.status(400).json({message : 'bad request'})
          }

          await user.destroy()
          return res.status(200).json({ message: `Utilisateur ${email} supprimé avec succès` })
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