const express = require('express');

const router = express.Router();

const Usercontroller = require('../controllers/user');

router.post('/add_user',Usercontroller.newuser);
router.post('/login',Usercontroller.loginuser);
router.post('/addItem',Usercontroller.addITEM);
router.get('/getitem',Usercontroller.getITEM);

module.exports = router;