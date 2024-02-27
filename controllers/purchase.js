const Razorpay = require('razorpay');
const Order = require('../models/orders');
require('dotenv').config();

exports.purchasepremium = async (req, res, next) => {
  try {
   var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    })
    const amount = 2500;

    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      req.user.createOrder({ orderid: order.id, status: 'PENDING'}).then(() => {
        return res.status(201).json({ order, key_id: rzp.key_id });
      }).catch(err => {
        console.log('order creation error:',err);
       return res.status(500).json({ error: err})
      })
    })
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Something went Wrong", error: err })
  }
}

exports.updateTransactionStatus = async (req, res, next) => {
   try{

    const {payment_id, order_id} = req.body;;
    const order = await Order.findOne({where: {orderid: order_id}})
    const promise1 = order.update({ paymentid: payment_id, status: 'SUCCESSFUL'})
    const promise2 = req.user.update({ ispremiumuser: true});

    Promise.all([promise1, promise2]).then(() => {
      return res.status(202).json({success: true, message: "Transaction Successfull"});
    }).catch((error) => {
      throw new Error(error)
    })

   }  catch(err){
        console.log(err);
        res.status(403).json({ error:err, message: "something went wrong"})
   }
}