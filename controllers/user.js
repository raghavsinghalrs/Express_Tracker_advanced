const User = require('../models/users');

const newuser = async(req,res) => {
    try{
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const existingUser = await User.findOne({where :  { email: email }});
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const data = await User.create({name : name, email : email, password: password});
        res.status(201).json({newuser : data});
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
            console.log(existingUser.password);
            if(password === existingUser.password){
                console.log("I am in");
                res.json({ message: "Login successful" });
            } else {
                res.json({ message: "Wrong password" });
            }
        } else {
            res.json({ message: "Invalid! Create account" });
        }

    }catch(err){
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    } 
}

module.exports = {
    newuser,
    loginuser
}