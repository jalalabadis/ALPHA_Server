// models/Tag.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Tag = sequelize.define('Tag', {
    tagName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    timestamps: true,
});

// Export the Tag model
module.exports = Tag;
