const Product=require('../Controllers/Product')
const express=require('express')
const router=express.Router();
router
.post('/',Product.createProduct)
.get('/:id',Product.fetchProductbyId)
.get('/',Product.fetchProductbyFilter)
.patch('/:id',Product.updateProduct)
exports.ProductRouter=router