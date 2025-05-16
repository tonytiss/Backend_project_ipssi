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
    .trim(),

    
    email: body('email').notEmpty().withMessage("L'email est vide"),   /* pour le login */

    
    emailcreate: body('email')
        .if(body('email').exists())
        .notEmpty().withMessage("L'email est vide")  
        .isEmail().withMessage("L'email n'est pas valide")  
        .trim(),

    
    noteTitle: body('titre')
        .notEmpty().withMessage("Le titre est requis")
        .isLength({ max: 50 }).withMessage("Le titre ne doit pas dépasser 50 caractères")
        .trim(),

    noteContent: body('contenu')
        .notEmpty().withMessage("Le contenu est requis")
        .isLength({ max: 1000 }).withMessage("Le contenu ne doit pas dépasser 1000 caractères")
        .trim(),

    validationResult: (req, res, next) => {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            const firstMessage = result.array()[0].msg;
            return res.status(400).json({ error: firstMessage })
        }
        next()
    }
};

module.exports = validatorMiddlewares
