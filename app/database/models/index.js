const User = require('./User')
const Note = require('./Notes')

// Déclaration des associations
User.hasMany(Note, { foreignKey: 'userId', onDelete: 'CASCADE' })
Note.belongsTo(User, { foreignKey: 'userId' })

module.exports = {
  User,
  Note
}