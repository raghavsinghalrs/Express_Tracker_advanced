const Sequelize = require('sequelize').Sequelize;
const mysql = require('mysql2');

const sequelize = new Sequelize('expenses','root','22sep2001',{
    dialect : 'mysql',
    host: 'localhost'
});

module.exports = sequelize;