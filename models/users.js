const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const User = sequelize.define('user',{
    id : {
        type : Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING,
        unique: true
    },
    password: {
        type: Sequelize.STRING
    },
    ispremiumuser : {
        type :  Sequelize.BOOLEAN
    },
    totalexpense : {
        type : Sequelize.INTEGER
    }

});

module.exports = User;