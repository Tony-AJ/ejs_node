const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const Product = require('./product');

const Order = sequelize.define('order', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

// Define associations
Order.belongsToMany(Product, { through: 'OrderItem' }); // Many-to-many relationship with Product
Product.belongsToMany(Order, { through: 'OrderItem' }); // Many-to-many relationship with Order

module.exports = Order;
