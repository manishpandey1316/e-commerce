const Brand=require('../Controllers/Brand')
const express=require('express')
const router=express.Router();
router
.post('/',Brand.createBrand)
.get('/',Brand.fetchBrand)
exports.BrandRouter=router