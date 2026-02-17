const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserPreferences = sequelize.define('UserPreferences', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Foreign key to users table'
    },
    preference_key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'e.g., "favorite_cities", "theme"'
    },
    preference_value: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: 'Flexible JSON storage for any preference data'
    }
  }, {
    tableName: 'user_preferences',
    underscored: true,
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: false, // Only track updates, not creation
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'preference_key'],
        name: 'unique_user_preference'
      }
    ]
  });

  return UserPreferences;
};