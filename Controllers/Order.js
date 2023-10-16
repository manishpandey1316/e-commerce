const {Order} = require('../Models/Order')
const {Cart}=require('../Models/Cart')
exports.createOrder= async (req,res)=>
{

  const {id}=req.user    
    const order = new Order({...req.body,userId:id})
    const doc= await order.save().then(t=>t.populate({path: 'orderedProducts',populate:{path:'product'}})).then(t=>t)
    try{
    return res.status(201).json(doc)
    } 
   catch(err)
   {
      return res.status(501).json(err)
   }
   
}

exports.fetchOrderByUser=async (req,res)=>
{
    const {id}=req.user
    const doc=await Order.find({userId:id}).populate({path: 'orderedProducts',populate:{path:'product'}})
   
    try{
      
    return res.status(201).json(doc)
    }
   catch(err)
   {
     return res.status(501).json(err)
   }
}


exports.updateOrder=async (req,res)=>
{
    try{
    const doc=await Order.findByIdAndUpdate(req.params.id,req.body,{new:true}).populate({path: 'orderedProducts',populate:{path:'product'}})
    return res.status(201).json(doc)
    }
   catch(err)
   {
     return res.status(501).json(err)
   }
}


exports.fetchOrderbyFilter=async (req,res)=>
{
   
    let query = Order.find({}) 
    let query2 = Order.find({})
 
    if(req.query._sort && req.query._order)
    {
        query=query.sort({[req.query._sort]:req.query._order})
    } 

    const skipCount=(req.query._page-1)*req.query._limit
    query=query.skip(skipCount).limit(req.query._limit).populate({path: 'orderedProducts',populate:{path:'product'}})
    
    const doc=await query.exec()
    const docCount=await query2.count().exec()
    res.set('X-Total-Count',docCount)
    try{
    return res.status(201).json(doc)
    }
   catch(err)
   {
     return res.status(501).json(err)
   }
}

