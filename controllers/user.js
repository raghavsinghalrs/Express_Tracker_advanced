const User = require('../models/users');
const Expense = require('../models/expense');

const bcrypt = require('bcrypt');
const newuser = async(req,res) => {
    try{
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const existingUser = await User.findOne({where :  { email: email }});
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const saltrounds = 10;
        bcrypt.hash(password,saltrounds,async(err,hash) => {
            console.log(err);
            await User.create({name : name, email : email, password: hash});

            res.status(201).json({message: "Successfully created new user"});
        })
    }catch(err){
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const loginuser = async(req,res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
        const existingUser = await User.findOne({where :  { email: email }});
        if (existingUser) {
            bcrypt.compare(password,existingUser.password,(err,response)=>{
                if(response === true){
                    res.json({ message: "Login successful" });
                }else {
                    res.json({ message: "Wrong password" });
                }
            });
        } else {
            res.json({ message: "Invalid! Create account" });
        }

    }catch(err){
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    } 
}

const addITEM = async(req,res) => {
    try{
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;
        await Expense.create({amount : amount, description : description, category : category});
        res.status(201).json({message: "Your expenses added!"});
    }catch(err){
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getITEM = async(req,res) => {
    try{
        const data = await Expense.findAll();
        res.status(200).json({data});
    }catch(err){
        console.error("Error occurred while counting rows:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    newuser,
    loginuser,
    addITEM,
    getITEM
}