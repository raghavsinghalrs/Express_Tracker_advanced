const User = require('../models/users');
const Expense = require('../models/expense');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

function generateAccesstoken(id,name){
    return jwt.sign({userid : id, name : name}, "112dfg345hdbbvbdjv2349823923fnjdvbjfbvjr8y843r834r4rl")
}

const loginuser = async(req,res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
        const existingUser = await User.findOne({where :  { email: email }});
        if (existingUser) {
            bcrypt.compare(password,existingUser.password,(err,response)=>{
                if(response === true){
                    res.json({ message: "Login successful",token : generateAccesstoken(existingUser.id,existingUser.name)});
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

const addITEM = async(req, res) => {
    try {
        const { amount, description, category } = req.body;
        const newItem = await Expense.create({ amount: amount, description: description, category: category, userId : req.user.id});

        res.status(201).json({ newItem });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getITEM = async(req,res) => {
    try{
        const data = await Expense.findAll({where : {userId : req.user.id}});
        console.log("data",data);
        res.status(200).json({data});
    }catch(err){
        console.error("Error occurred while counting rows:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const deleteITEM = async(req,res) => {
    try{
        const id = req.params.id;
        await Expense.destroy({where: {id:id}});
        res.status(200).json("Deleted successfully");
    }catch(err){
        console.log(err);
    }
}

module.exports = {
    newuser,
    loginuser,
    addITEM,
    getITEM,
    deleteITEM
}