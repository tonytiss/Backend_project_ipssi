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

      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'Tous les champs sont requis : firstName, lastName, email, password.' });
      }

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
        const { id } = req.params
    
        try {
          const user = await User.findByPk(Number(id))
    
          if (!user) {

            return res.status(404).json({ error: ` id ${id} Utilisateur non trouvé` })
          }
          if (!(email == user.email || role == 'admin')) {
  
            return res.status(400).json({message : 'bad request'})
          }

          await user.destroy()
          return res.status(200).json({ message: `Utilisateur ${email} supprimé avec succès` })
        } catch (err) {
          return res.status(500).json({ err })
        }
    },
    async getOneByEmail(req, res) {

      const {decodedToken} = req

      if(!decodedToken){
          return res.status(401).json({ message: "no decoded token"})
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
    },
    async update(req, res) {
      const { id } = req.params;
      const { email, role } = req.decodedToken;
      const {
        firstName,
        lastName,
        email: newEmail,
        password
      } = req.body;
    
      try {
        const user = await User.findByPk(Number(id));
    
        if (!user || !(email === user.email || role === 'admin')) {
          return res.status(400).json({ message: 'bad request' });
        }
    
        if (firstName !== undefined && firstName.trim() !== '') {
          user.firstName = firstName;
        }
    
        if (lastName !== undefined && lastName.trim() !== '') {
          user.lastName = lastName;
        }
    
        if (
          newEmail !== undefined &&
          newEmail.trim() !== '' &&
          newEmail !== user.email
        ) {
          const existingUser = await User.findOne({ where: { email: newEmail } });
          if (existingUser) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
          }
          user.email = newEmail;
        }
    
        if (password !== undefined && password.trim() !== '') {
          user.password = password;
          user.changed('password', true); // Active le hook pour hacher
        }
    
        await user.save();
    
        return res.status(200).json({
          message: 'Utilisateur mis à jour avec succès',
          user
        });
    
      } catch (err) {
        console.trace(err);
        return res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
      }
    },
    async updateRoleToAdmin(req, res) {
      const { id } = req.params;
  
      try {
          const user = await User.findByPk(id);
  
          if (!user) {
              return res.status(404).json({ message: `Utilisateur avec l'id ${id} introuvable.` });
          }
  
          if (user.role === 'admin') {
              return res.status(400).json({ message: 'Cet utilisateur est déjà administrateur.' });
          }
  
          user.role = 'admin';
          await user.save();
  
          return res.status(200).json({ message: `Utilisateur ${user.email} promu administrateur avec succès.` });
      } catch (error) {
          console.error('Erreur lors de la mise à jour du rôle:', error);
          return res.status(500).json({ message: 'Erreur serveur.' });
      }
  }
}


module.exports = userController