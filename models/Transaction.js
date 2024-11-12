const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const User = require('./User');

const Transaction = sequelize.define('Transaction', {
 
  email:{
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'email'
    }
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

}, {
    // Other model options
    timestamps: true  // Adds createdAt and updatedAt fields
  });

 Transaction.belongsTo(User, { foreignKey: 'email', targetKey: 'email' });

  module.exports = Transaction;