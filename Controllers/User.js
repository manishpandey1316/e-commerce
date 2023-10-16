const {User}=require('../Models/User')
const crypto =require('crypto')
const {sanatizeUser}=require('../services/common')
const jwt = require('jsonwebtoken');
exports.createUser= async (req,res)=>
{
  try{
  const salt = crypto.randomBytes(16);
  crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256',async function(err, hashedPassword) {
    const user = new User({...req.body,email:req.body.email.toLowerCase(),password:hashedPassword,salt})

        const doc=await user.save()
       req.login(sanatizeUser(doc),{session: false},(err)=>
       {
          if(err)
          {
            res.status(501).json(err)
          }
          const token = jwt.sign(sanatizeUser(req.user), process.env);
          return res.cookie('jwt',token,{ expires: new Date(Date.now() + 900000), httpOnly: true })
          .status(201).json(sanatizeUser(req.user))
       })
        
      })}
   catch(err)
   {
      return res.status(501).json(err)
   }
   
}
exports.fetchUserInfo=async (req,res)=>
{
   const {id} = req.user
    try{
    const doc=await User.findById(id,'-password')
    return res.status(201).json(doc)
    }
   catch(err)
   {
     return res.status(501).json(err)
   }
}
exports.loginUser=async (req,res)=>
{
  
   if (!req.user.id) {
      return res.status(400).json(req.user);
  }
   const token = jwt.sign(sanatizeUser(req.user), process.env.JWT_SECRET);
   return res.cookie('jwt',token,{ expires: new Date(Date.now() + 900000), httpOnly: true })
   .status(201).json({...sanatizeUser(req.user)})
}

exports.updateUserInfo=async (req,res)=>
{
   const {id}=req.user
    try{
    const doc=await User.findByIdAndUpdate(id,{...req.body},{new:true},{projection:'-password'})
    return res.status(201).json(doc)
    }
   catch(err)
   {
     return res.status(501).json(err)
   }
}

exports.check=async(req,res)=>
{
   if(req.user)
   {
      return res.json(sanatizeUser(req.user))
   }
   else{
      return res.sendStatus(401)
   }   
}

exports.logout=(req,res)=>
{
    res.clearCookie('jwt');
    return res.sendStatus(201);
}