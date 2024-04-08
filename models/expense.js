const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const Expense = sequelize.define('expense',{
    id : {
        type : Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    amount: {
        type: Sequelize.INTEGER
    },
    description: {
        type: Sequelize.STRING,
    },
    category: {
        type: Sequelize.STRING
    }
});

module.exports = Expense;