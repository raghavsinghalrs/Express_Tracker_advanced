const express = require('express');

const router = express.Router();

const Usercontroller = require('../controllers/user');
const authentication = require('../middleware/auth');

router.post('/add_user',Usercontroller.newuser);
router.post('/login',Usercontroller.loginuser);
router.post('/addItem',authentication.authenticate,Usercontroller.addITEM);
router.get('/getitem',authentication.authenticate,Usercontroller.getITEM);
router.delete('/deleteitem/:id',Usercontroller.deleteITEM);
 
module.exports = router;