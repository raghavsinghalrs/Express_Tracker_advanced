const User = require('../models/users');

const newuser = async(req,res) => {
    try{
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const data = await User.create({name : name, email : email, password: password});
        res.status(201).json({newuser : data});
    }catch(err){
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    newuser
}