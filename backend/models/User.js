const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    auth0_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      comment: 'Auth0 user identifier (sub claim from JWT)'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true 
    }
  }, {
    tableName: 'users',
    underscored: true, 
    timestamps: true   // Adds createdAt and updatedAt automatically
  });

  return User;
};