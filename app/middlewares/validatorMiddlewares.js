const { body, validationResult } = require('express-validator')

const validatorMiddlewares = {
    
    password: body('password')
    .if(body('password').exists())    /*  existe() pour le cas de l'update */
    .notEmpty().withMessage("Le mot de passe est requis")
    .isStrongPassword({
      minLength: 12,
      minSymbols: 1,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1
    }).withMessage("Le mot de passe doit contenir au moins 12 caractères, avec une majuscule, une minuscule, un chiffre et un symbole.")
    .isLength({ max: 50 }).withMessage("Le mot de passe ne doit pas dépasser 50 caractères.")
    .trim(),

    
    email: body('email').notEmpty().isLength({ max: 50 }).withMessage("L'email ne doit pas dépasser 50 caractères.").withMessage("L'email est vide"),   /* pour le login */

    
    emailcreate: body('email')
        .if(body('email').exists())
        .notEmpty().withMessage("L'email est vide")  
        .isEmail().withMessage("L'email n'est pas valide") 
        .isLength({ max: 50 }).withMessage("L'email ne doit pas dépasser 50 caractères.")
        .trim(),


    firstname: body('firstName')
        .if(body('firstName').exists())
        .notEmpty().withMessage("Le firstname est requis")
        .isLength({ max: 50 }).withMessage("L'email ne doit pas dépasser 50 caractères."),

    lastname: body('lastName')
        .if(body('lastName').exists())
        .notEmpty().withMessage("Le firstname est requis")
        .isLength({ max: 50 }).withMessage("L'email ne doit pas dépasser 50 caractères."),    

    noteTitle: body('titre')
        .notEmpty().withMessage("Le titre est requis")
        .isLength({ max: 50 }).withMessage("Le titre ne doit pas dépasser 50 caractères")
        .trim(),

    noteContent: body('contenu')
        .notEmpty().withMessage("Le contenu est requis")
        .isLength({ max: 1000 }).withMessage("Le contenu ne doit pas dépasser 1000 caractères")
        .trim(),

    validationResult: (req, res, next) => {
        try {
            const result = validationResult(req)
            if (!result.isEmpty()) {
            const firstMessage = result.array()[0].msg;
            return res.status(400).json({ error: firstMessage })
            }
            next()
        } catch (error) {
            console.error('Validation error:', error);
            return res.status(500).json({ error: 'Erreur interne de validation' })
        }
    }
};

module.exports = validatorMiddlewares
