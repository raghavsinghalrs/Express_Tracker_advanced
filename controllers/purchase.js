const Razorpay = require('razorpay');
const Order = require('../models/orders');

const purchasePremium = async (req, res) => {
    console.log("in premium: ")
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const amount = 2500;
        
        const razorpayOrder = await rzp.orders.create({amount, currency: "INR"});

        const newOrder = await Order.create({
            orderid: razorpayOrder.id,
            status: 'PENDING',
            userId: req.user.id,
        });
        
        res.status(201).json({ order: razorpayOrder, key_id: process.env.RAZORPAY_KEY_ID });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateTransactionStatus = async(req,res) => {
    console.log("i am in update..");
    const {order_id, payment_id} = req.body;
    console.log(order_id,"order id");
    console.log(payment_id,"payment id")
    await Order.findOne({where : {orderid : order_id}}).then(order => {
        if(payment_id === null){
            console.log("null");
            order.update({status : 'FAILED'}).then(() => {
                res.status(400).json({message : "Transaction failed"});
            }).catch((err) => {
                throw new Error(err);
            });
        }else{
            order.update({paymentid : payment_id, status : 'SUCCESSFUL'}).then(() => {
                req.user.update({ispremiumuser : true}).then(() => {
                    res.status(202).json({message : "Transaction successful"});
                }).catch((err) => {
                    throw new Error(err);
                })
            });
        }
    });
}

module.exports = {
    purchasePremium,
    updateTransactionStatus
};
