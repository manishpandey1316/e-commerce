const Order=require('../Controllers/Order')
const express=require('express')
const router=express.Router();
router
.post('/',Order.createOrder)
.get('/all',Order.fetchOrderbyFilter)
.get('/',Order.fetchOrderByUser)
.patch('/:id',Order.updateOrder)


exports.OrderRouter=router