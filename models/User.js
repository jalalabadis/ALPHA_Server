const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const User = sequelize.define('User', {
  //User Info
  email:{
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  userName:{
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  wallet:{
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  password:{
    type: DataTypes.STRING,
    allowNull: false
  },
  ////User condition
  type:{
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Level
  xp:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  strength: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vitality: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  luck: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  ////Mony
  silver: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: false
  },
  gold: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: false
  }

}, {
  // Other model options
  timestamps: true  // Adds createdAt and updatedAt fields
});


module.exports = User;
