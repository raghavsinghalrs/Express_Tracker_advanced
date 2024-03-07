const express = require('express');

const router = express.Router();

const Usercontroller = require('../controllers/user');

router.post('/add_user',Usercontroller.newuser);

module.exports = router;