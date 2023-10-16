const User=require('../Controllers/User')
const express=require('express')
const router=express.Router();
router
.get('/',User.fetchUserInfo)
.patch('/',User.updateUserInfo)
exports.UserRouter=router