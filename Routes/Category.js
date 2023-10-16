const Category=require('../Controllers/Category')
const express=require('express')
const router=express.Router();
router
.post('/',Category.createCategory)
.get('/',Category.fetchCategory)
exports.CategoryRouter=router