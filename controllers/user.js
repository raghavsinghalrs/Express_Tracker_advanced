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
        const user_present = await User.findOne({ where: { email: email } });
        const fetching_uuid = await forgot_password.findOne({where : {userId : user_present.id}});
        if(!fetching_uuid){
            const data = await forgot_password.create({
                id : uuidv4(), 
                isactive : true,
                userId: user_present.id
            });
            const ans = await sendmail(data.id);
            if(ans){
                res.status(201).json({message : 'Message sent'})
            }else{
                res.status(401).json({ error: "Internal Server Error" });
            }
        }
        else if(user_present){
            await forgot_password.update({isactive : true}, {where : {id : fetching_uuid.id}});
            const ans = await sendmail(fetching_uuid.id);
            if(ans){
                res.status(201).json({message : 'Message sent'})
            }else{
                res.status(401).json({ error: "Internal Server Error" });
            }

        }else{
            res.status(500).json({message : 'Either User not found or you have already changed your password'});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function sendmail(uuid) {
    const transporter = nodemailer.createTransport({
        host : 'smtp.gmail.com',
        port: 587,
        secure: false, 
        auth: {
            user: "22sep2001.rs@gmail.com",
            pass: "kpgn mvcd fobf qfzj",
        }
    });
    try{
        const info = await transporter.sendMail({
            from: '"Admin👻" <22sep2001.rs@gmail.com>',
            to: "22sep2001.rs@gmail.com",
            subject: "Reset password",
            text: `http://localhost:3000/resetpassword/${uuid}`, 
          });
        
          console.log("Message sent: %s", info.messageId);
          return true;
    }catch(err){
        console.log(err);
        return false;
    }

}

const changepassword = async(req,res) => {
    const uuid = req.params.uuid;
    const ispresent = await forgot_password.findOne({where : {id : uuid}});
    if(ispresent && ispresent.isactive){
        try{
            res.redirect(`http://localhost:5500/new_password.html?uuid=${uuid}`);
        }catch(err){
            console.log(err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    else{
        return res.json({message : 'Either uuid is not present or it is not active'})
    }
}

const updatepassword = async(req,res) => {
    try{
        const password = req.body.password;
        const uuid = req.body.uuid;
        const user = await forgot_password.findOne({where : {id : uuid}});
        const existingUser = await User.findOne({where :  { id: user.userId }});
        if (existingUser) {
            const saltrounds = 10;
            bcrypt.hash(password, saltrounds, async (err, hash) => {
                if (err) {
                    console.error('Error hashing password:', err);
                    res.status(500).json({ message: "Error updating password" });
                    return;
                }

                try {
                    await User.update({ password: hash }, { where: { id: existingUser.id } });
                    res.status(201).json({ message: "Password Updated Successfully" });
                } catch (updateErr) {
                    console.error('Error updating user password in database:', updateErr);
                    res.status(500).json({ message: "Error updating password" });
                }
            });
        }else{
            res.status(501).json({ error: "User not found" });
        }
    }catch(err){
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

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
            if (err) {
                console.error('Error hashing password:', err);
                res.status(500).json({ message: "Error updating password" });
                return;
            }
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

const downloadsheet = async (req, res) => {
    try{
        const ispremium = await User.findAll({where : {id : req.user.id}});
        if(ispremium.ispremiumuser){

        }else{
            res.status(401).json({message : 'Unauthorized'});
        }
    } catch(err) {

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
    updatepassword,
    downloadsheet
}
