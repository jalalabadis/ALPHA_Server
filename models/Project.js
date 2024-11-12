const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const User = require('./User');

const Project = sequelize.define('Project', {
 
 userID:{
  type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  proposition: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ideal: {
    type: DataTypes.STRING,
    allowNull: true
  },
  points: {
    type: DataTypes.STRING,
    allowNull: true
  }

}, {
    // Other model options
    timestamps: true
  });

 Project.belongsTo(User, { foreignKey: 'userID', targetKey: 'id' });

  module.exports = Project;