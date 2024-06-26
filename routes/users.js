const express = require('express');

const router = express.Router();

const Usercontroller = require('../controllers/user');
const purchaseController = require('../controllers/purchase');
const authentication = require('../middleware/auth');

router.post('/add_user',Usercontroller.newuser);
router.post('/login',Usercontroller.loginuser);
router.post('/addItem',authentication.authenticate,Usercontroller.addITEM);
router.get('/getitem',authentication.authenticate,Usercontroller.getITEM);
router.delete('/deleteitem/:id',authentication.authenticate,Usercontroller.deleteITEM);
router.get('/premiummembership',authentication.authenticate,purchaseController.purchasePremium);
router.post('/updatetransactionstatus',authentication.authenticate,purchaseController.updateTransactionStatus);
router.get('/leaderboard',Usercontroller.leaderboarddata);
router.post('/forgotpassword',Usercontroller.forgot);
router.get('/resetpassword/:uuid',Usercontroller.changepassword);
router.post('/updatepassword',Usercontroller.updatepassword);
router.get('/downloadsheet',authentication.authenticate,Usercontroller.downloadsheet);
 
module.exports = router;