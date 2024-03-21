const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const fileUrl = sequelize.define('downloadfile' ,{
   id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
   } ,
   fileUrl: {
     type: Sequelize.STRING,
     allowNull: false
   }
});

module.exports =  fileUrl;