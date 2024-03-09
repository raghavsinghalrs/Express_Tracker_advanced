const express = require('express');

const router = express.Router();

const Usercontroller = require('../controllers/user');

router.post('/add_user',Usercontroller.newuser);
router.post('/login',Usercontroller.loginuser);

module.exports = router;