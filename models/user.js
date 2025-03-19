const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const Order = require('./order');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING,
  email: Sequelize.STRING
});

// Define associations
User.hasMany(Order); // A user can have many orders
Order.belongsTo(User); // An order belongs to a user

module.exports = User;
