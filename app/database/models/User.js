const { Model, DataTypes } = require('sequelize');
const argon2 = require('argon2');
const { sequelizeClient } = require('../dbConnect');

class User extends Model {}

User.init({
    firstName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM(["user", "admin"]),
        allowNull: false,
        defaultValue: "user"
    }
}, {
    sequelize: sequelizeClient,
    tableName: "Users"
})

// Hook beforeSave pour hacher le mot de passe avant de sauvegarder l'utilisateur
User.addHook('beforeSave', async (user) => {
    if (user.changed('password')) {
        try {
            const hashedPassword = await argon2.hash(user.password, {
                type: argon2.argon2id,
            });
            user.password = hashedPassword
        } catch (err) {
            console.error('Erreur lors du hachage du mot de passe:', err)
            throw new Error('Erreur lors du hachage du mot de passe')
        }
    }
})

module.exports = User

/* console.log(User == sequelizeClient.models.User)

async function syncUserWithDb() {
    await User.sync({
    alter: true
    })
}

syncUserWithDb() */
