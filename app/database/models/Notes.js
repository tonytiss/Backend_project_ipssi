const { Model, DataTypes } = require('sequelize')
const { sequelizeClient } = require('../dbConnect')

class Note extends Model {}

Note.init({
    titre: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    contenu: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    sequelize: sequelizeClient,
    tableName: 'Notes'
});

module.exports = Note

/* console.log(Note == sequelizeClient.models.Note)

async function syncUserWithDb() {
    await Note.sync({
    alter: true
    })
}

syncUserWithDb()  */
