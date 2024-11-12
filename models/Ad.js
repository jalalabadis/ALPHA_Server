const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const Project = require('./Project');
const User = require('./User');

const Ad = sequelize.define('Ad', {
  userID:{
    type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
  ProjectID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Project,
      key: 'id'
    }
  },
  Status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  video_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  thumb: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }

}, {
    // Other model options
    timestamps: true  // Adds createdAt and updatedAt fields
  });

 Ad.belongsTo(Project, { foreignKey: 'ProjectID', targetKey: 'id' });
 Ad.belongsTo(User, { foreignKey: 'userID', targetKey: 'id' });

  module.exports = Ad;