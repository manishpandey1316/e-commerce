const Cart=require('../Controllers/Cart')
const express=require('express')
const router=express.Router();
router
.get('/',Cart.fetchCart)
.post('/',Cart.createCart)
.patch('/:id',Cart.updateCart)
.delete('/:id',Cart.deleteCart)
exports.CartRouter=router