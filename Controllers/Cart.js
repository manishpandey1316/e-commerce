const {Cart} = require('../Models/Cart')

exports.createCart= async (req,res)=>
{
   const {id}=req.user
    try{
    const cart = new Cart({...req.body,userId:id})
    const doc= await cart.save().then(t => t.populate('productId')).then(t => t)
    return res.status(201).json(doc)
    }
   catch(err)
   {
      return res.status(501).json(err)
   }
   
}

exports.fetchCart=async (req,res)=>
{
  const {id}=req.user
    try{
    const doc=await Cart.find({userId:id}).populate('productId')
    return res.status(201).json(doc)
    }
   catch(err)
   {
     return res.status(501).json(err)
   }
}


exports.updateCart=async (req,res)=>
{
    const {id}=req.user
    try{
    const doc=await Cart.findByIdAndUpdate(req.params.id,{...req.body,userId:id},{new:true}).populate('productId')
  
    return res.status(201).json(doc)
    }
   catch(err)
   {
     return res.status(501).json(err)
   }
}
exports.deleteCart=async (req,res)=>
{
    try{
    const doc=await Cart.findByIdAndDelete(req.params.id).populate('productId')
    return res.status(201).json(doc)
    }
   catch(err)
   {
     return res.status(501).json(err)
   }
}