const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Item = sequelize.define('expense' , {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
 expenseamount: {
    type: Sequelize.INTEGER,
    allowNull: false
 },
 description: {
    type: Sequelize.STRING,
    allowNull: false
 },
 category: {
    type: Sequelize.STRING,
    allowNull: false
 }
});

module.exports = Item;