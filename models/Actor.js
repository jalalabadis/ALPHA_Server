// models/Actor.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Actor = sequelize.define('Actor', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    actorID: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    actorType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    profile: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    videoUrl: {
      type: DataTypes.STRING, // For storing image URL or file path
      allowNull: false,
  },

}, {
    timestamps: true, // Add created_at and updated_at timestamps
});

// Export the Actor model
module.exports = Actor;
