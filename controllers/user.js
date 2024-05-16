const User = require('../models/users');
const Expense = require('../models/expense');
const forgot_password = require('../models/forgotpassword_requests');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Sequelize = require('../util/database');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

const forgot = async (req, res) => {
    try {
        const email = req.body.email;
        console.log(email);
        const user_present = await User.findOne({ where: { email: email } });
        console.log(user_present);
        if(user_present){
            const data = await forgot_password.create({
                id : uuidv4(), 
                isactive : true,
                userId: req.user.id,
            });
            const transporter = nodemailer.createTransport({
                host : 'smtp.gmail.com',
                port: 587,
                secure: false, 
                auth: {
                    user: "22sep2001.rs@gmail.com",
                    pass: "kpgn mvcd fobf qfzj",
                }
            })
            try{
                const info = await transporter.sendMail({
                    from: '"Maddison Foo Koch 👻" <22sep2001.rs@gmail.com>', // sender address
                    to: "22sep2001.rs@gmail.com", // list of receivers
                    subject: "Hello ✔", // Subject line
                    text: "Hello world?", // plain text body
                    html: "<b>Hello world?</b>", // html body
                  });
                
                  console.log("Message sent: %s", info.messageId);
                  res.status(201).json({message : 'Message sent'});
            }catch(err){
                console.log(err);
                res.status(401).json({ error: "Internal Server Error" });
            }

        }else{
            res.status(500).json({message : 'User not found'});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const changepassword = async(req,res) => {
    const uuid = req.params.uuid;
    const ispresent = await forgot_password.findOne({where : {id : uuid}});
    if(ispresent && ispresent.isactive){
        try{
            return res.redirect(`http://localhost:5500/new_password.html?email=${uuid}`);
        }catch(err){
            console.log(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
    else{
        return res.json({message : 'Either uuid is not present or it is not active'})
    }
}

// const updatepassword = async(req,res) => {
//     try{
//         const password = req.body.password;
//         const 
//     }catch(err){
//         console.log(err);
//     }
// }

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

const addITEM = async (req, res) => {
    const t = await Sequelize.transaction(); 
    try {
        const { amount, description, category } = req.body;

        const newItem = await Expense.create({
            amount: amount,
            description: description,
            category: category,
            userId: req.user.id
        }, { transaction: t }); 

        const user = await User.findByPk(req.user.id, { transaction: t }); 

        if (!user) {
            await t.rollback(); 
            return res.status(404).json({ error: "User not found" });
        }

        user.totalexpense = (user.totalexpense || 0) + Number(amount);

        await user.save({ transaction: t }); 

        await t.commit(); 

        res.status(201).json({ newItem });

    } catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



const getITEM = async(req,res) => {
    try{
        const data = await Expense.findAll({where : {userId : req.user.id}});
        console.log("data",data);
        const premiumuserdata = await User.findByPk(req.user.id);
        console.log(premiumuserdata)
        res.status(200).json({data,premiumuserdata : premiumuserdata });
    }catch(err){
        console.error("Error occurred while counting rows:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const deleteITEM = async(req,res) => {
    const t = await Sequelize.transaction(); 
    try{
        const itemid = req.params.id;
        const userid = req.user.id;

        const item = await Expense.findOne({ where: { id: itemid, userId: userid } }, { transaction: t });
        const user = await User.findByPk(req.user.id, { transaction: t }); 

        if (!item) {
            t.rollback();
            return res.status(404).json({ error: "Item not found or you don't have permission to delete it." });
        }

        if (!user) {
            await t.rollback(); 
            return res.status(404).json({ error: "User not found" });
        }
        user.totalexpense = user.totalexpense - item.amount;
        await user.save({ transaction: t }); 
        await item.destroy();

        await t.commit(); 
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (err) {
        await t.rollback(); 
        console.error("Error deleting item:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const leaderboarddata = async (req, res) => {
    try {
        const users = await User.findAll({
            order: [['totalexpense', 'DESC']]
        });
        res.status(201).json({leaderboard : users});
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    newuser,
    loginuser,
    addITEM,
    getITEM,
    deleteITEM,
    leaderboarddata,
    forgot,
    changepassword,
    // updatepassword
}