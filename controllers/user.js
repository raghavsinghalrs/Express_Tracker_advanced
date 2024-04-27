const User = require('../models/users');
const Expense = require('../models/expense');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Sequelize = require('../util/database');
var SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;

const forgot = async (req, res) => {
    try {
        const email = req.body.email;
        const user_present = await User.findOne({ where: { email: email } });
        if(user_present){
            const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
            const sender = {
                email : '22sep2001.rs@gmail.com',
                name : 'PAT CUMMINS',
            };
            const reciever = [
                {
                    email : email,
                }
            ];
            try{
                const sendemail = await apiInstance.sendTransacEmail({
                    sender,
                    to : reciever,
                    subject : 'Testemail',
                    textContent : 'Testemail',
                });
                return res.send(sendemail);
            }catch(err){
                console.log(err);
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


// const forgot = async(req,res) => {
//     try{
//         const email = req.body.email;
//         const user_present = await User.findOne({where :  { email: email }});
//         if(user_present){
//             console.log('User found:', user_present);
//             console.log('brevo module:', brevo);
//             const apiInstance = new brevo.TransactionalEmailsApi();
//             const apiKey = new apiInstance.authentications['apiKey'];
//             apiKey.apiKey = process.env.API_KEY;
//             if(!process.env.API_KEY){
//                 return;
//             }
//             const sendSmtpEmail = new brevo.SendSmtpEmail();
//             sendSmtpEmail.subject = "My {{params.subject}}";
//             sendSmtpEmail.htmlContent = "<html><body><h1>Common: This is my first transactional email {{params.parameter}}</h1></body></html>";
//             sendSmtpEmail.sender = { "name": "raghav", "email": "22sep2001.rs@gmail.com" };
//             sendSmtpEmail.to = [
//                     { "email": "22sep2001.rs@gmail.com", "name": "sample-name" }
//                 ];
//             sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
//             sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };
//             if(req.body?.attachments?.length){
//                 sendSmtpEmail.attachment = attachments;
//             }
//             if(req.body?.cc&&req.body?.cc?.length){
//                 sendSmtpEmail.cc = cc;
//             }
//             if(req.body?.bcc && req.body?.bcc?.length){
//                 sendSmtpEmail.bcc = bcc;
//             }
//             const response = await apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data){
//                 console.log('API called successfully. Returned data:'+ JSON.stringify(data));
//                 res.status(201).json({message : 'SUCCESS'});
//             },function(err){
//                 console.log(err);
//             })
//             return response;
//         }
//     }catch(err){
//         console.log(err);
//         res.status(500).json({ error: "Internal Server Error" });
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
    forgot
}