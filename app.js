const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const sequelize = require('./util/database');
const userroute = require('./routes/users');
const Expense = require('./models/expense');
const order = require('./models/orders');
const User = require('./models/users');
const password = require('./models/forgotpassword_requests');

app.use(cors());
app.use(express.json());

app.use(userroute);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(order);
order.belongsTo(User);

User.hasMany(password);
password.belongsTo(User);

async function func(){
    await sequelize.sync()
    app.listen(3000,()=>console.log("Listening on port 3000"));
}
func();



