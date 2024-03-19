const express = require('express');
const cors = require('cors');

const app = express();

const sequelize = require('./util/database');
const userroute = require('./routes/users');
const Expense = require('./models/expense');
const User = require('./models/users');

app.use(cors());
app.use(express.json());

app.use(userroute);

User.hasMany(Expense);
Expense.belongsTo(User);

async function func(){
    await sequelize.sync()
    app.listen(3000,()=>console.log("Listening on port 3000"));
}
func();



