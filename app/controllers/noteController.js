const { User, Note } = require('../database/models')

async function createNote(req, res) {
    const { titre, contenu } = req.body
    const email = req.decodedToken.email

    try {
        // Trouver l'utilisateur par email
        const user = await User.findOne({ where: { email } })

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." })
        }

        const note = await Note.create({
            titre,
            contenu,
            userId: user.id // associer avec l'id trouvé
        })

        return res.status(201).json(note)
    } catch (error) {
        console.error('Erreur lors de la création de la note:', error)
        return res.status(500).json({ message: "Erreur serveur lors de la création de la note." })
    }
}

async function getNote(req, res) {
  const { id: requestedId } = req.params
  const { email: tokenEmail, role } = req.decodedToken

  try {
    const tokenUser = await User.findOne({ where: { email: tokenEmail } })

    if (!tokenUser) {
      return res.status(401).json({ message: "Utilisateur non authentifié." })
    }

    if (!(tokenUser.id.toString() === requestedId || role === 'admin')) {
      return res.status(403).json({ message: "Accès refusé." })
    }

    const user = await User.findByPk(requestedId)
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." })
    }

    // Récupère ses notes
    const notes = await Note.findAll({ where: { userId: requestedId } })

    return res.json(notes);

  } catch (error) {
    console.error("Erreur lors de la récupération des notes :", error)
    return res.status(500).json({ message: "Erreur serveur." })
  }
}


async function deleteNote(req, res) {
    const noteId = req.params.id  // id de la note dans l'URL
    const { email, role } = req.decodedToken

    try {
        const note = await Note.findOne({
            where: { id: noteId },
            include: [{ model: User, attributes: ['email'] }]
        })

        if (!note) {
            return res.status(404).json({ message: "Note non trouvée." })
        }

        const ownerEmail = note.User.email

        if (!(email === ownerEmail || role === 'admin')) {
            return res.status(403).json({ message: "Accès refusé." })
        }

        await note.destroy()

        return res.json({ message: "Note supprimée avec succès." })
    } catch (error) {
        console.error('Erreur lors de la suppression de la note:', error)
        return res.status(500).json({ message: "Erreur serveur lors de la suppression de la note." })
    }
}

async function getAllNotesGroupedByUser(req, res) {
    try {
      const notes = await Note.findAll({
        include: [{
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email']
        }],
        order: [
          [User, 'id', 'ASC'],      // trie par utilisateur id
          ['createdAt', 'DESC']     // puis trie les notes par date de création décroissante
        ]
      });
  
      // On regroupe les notes par utilisateur dans un objet
      const groupedNotes = notes.reduce((acc, note) => {
        const user = note.User;
        if (!acc[user.id]) {
          acc[user.id] = {
            user: {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email
            },
            notes: []
          };
        }
        acc[user.id].notes.push({
          id: note.id,
          titre: note.titre,
          contenu: note.contenu,
          createdAt: note.createdAt
        });
        return acc;
      }, {});
  
      // convertion en tableau 
      const result = Object.values(groupedNotes);
  
      return res.json(result);
    } catch (error) {
      console.error('Erreur lors de la récupération des notes groupées:', error);
      return res.status(500).json({ message: 'Erreur serveur lors de la récupération des notes.' });
    }
  }
  
 

module.exports = {
    createNote,
    getNote,
    deleteNote,
    getAllNotesGroupedByUser
}

