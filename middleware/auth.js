const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { use } = require('../routes/users');

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const user_obj = jwt.verify(token, '112dfg345hdbbvbdjv2349823923fnjdvbjfbvjr8y843r834r4rl');
        const user = await User.findByPk(user_obj.userid);
        console.log(user);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = {
    authenticate
};