const Sequelize = require('sequelize');
const mysql = require('mysql2/promise');

const initializeDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'TonyAJ@2005'
    });
    await connection.query('CREATE DATABASE IF NOT EXISTS `node-complete`');
    await connection.end();
  } catch (err) {
    console.error('Error creating database:', err);
    throw err;
  }
};

(async () => {
  await initializeDatabase();
})();

const sequelize = new Sequelize('node-complete', 'root', 'TonyAJ@2005', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
