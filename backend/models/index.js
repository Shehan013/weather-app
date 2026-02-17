const sequelize = require('../config/database');
const User = require('./User')(sequelize);
const UserPreferences = require('./UserPreferences')(sequelize);

User.hasMany(UserPreferences, { 
  foreignKey: 'user_id',
  as: 'preferences'
});

UserPreferences.belongsTo(User, { 
  foreignKey: 'user_id',
  as: 'user'
});

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // Auto-updates tables based on models
    console.log('Database models synchronized');
  } catch (error) {
    console.error('Database sync error:', error.message);
  }
};

module.exports = {
  sequelize,
  User,
  UserPreferences,
  syncDatabase
};