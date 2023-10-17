const passport = require("passport");
const {checkAuthenticated} = require('../services/common')
const User=require('../Controllers/User')
const express=require('express')
const router=express.Router();
router
.post('/login',passport.authenticate('local',{session:false}),User.loginUser)
.post('/signup',User.createUser)
.get('/logout',User.logout)
.get('/check',checkAuthenticated(),User.check)
.post('/reset-password-request',User.resetRequest)
.post('/reset-password-confirm',User.resetConfirm)

exports.AuthRouter=router