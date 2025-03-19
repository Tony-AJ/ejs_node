const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'TonyAJ@2005', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
