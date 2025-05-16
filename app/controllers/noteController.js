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
    const { email: requestedEmail } = req.params; // email de l'utilisateur dont on veut les notes
    const { email: tokenEmail, role } = req.decodedToken;

    try {
        // Vérifier que l'utilisateur est autorisé (lui-même ou admin)
        if (!(tokenEmail === requestedEmail || role === 'admin')) {
            return res.status(403).json({ message: "Accès refusé." });
        }

        // Récupérer l'utilisateur pour avoir son id
        const user = await User.findOne({ where: { email: requestedEmail } });
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        // Récupérer toutes les notes liées à cet utilisateur
        const notes = await Note.findAll({
            where: { userId: user.id }
        });

        return res.json(notes);

    } catch (error) {
        console.error('Erreur lors de la récupération des notes:', error);
        return res.status(500).json({ message: "Erreur serveur lors de la récupération des notes." });
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

module.exports = {
    createNote,
    getNote,
    deleteNote
}

