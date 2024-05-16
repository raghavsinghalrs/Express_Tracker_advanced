const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const forgot_password = sequelize.define('forgotpassword',{
    id : {
        type : Sequelize.STRING,
        primaryKey : true,
        allowNull : false,
    },
    
    isactive : {
        type : Sequelize.BOOLEAN
    }
})

module.exports = forgot_password;