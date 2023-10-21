const {Product} = require('../Models/Product')

exports.createProduct= async (req,res)=>
{
    const data=req.body
    const discountedPrice=(100-data.discountPercentage)*price/100
    const product = new Product({...data,},discountedPrice)
    try{
        const doc=await product.save()
        return res.status(201).json(doc)
    }
   catch(err)
   {
      return res.status(501).json(err)
   }
   
}

exports.fetchProductbyId=async (req,res)=>
{
    try{
    const doc=await Product.findById(req.params.id)
    return res.status(201).json(doc)
    }
   catch(err)
   {
     return res.status(501).json(err)
   }
}
exports.fetchProductbyFilter=async (req,res)=>
{
   const {role} = req.user
    let query =  Product.find({}) 
    let query2 =  Product.find({})
    if(role==='user')
    {
      query=query.find({status:{$ne:"deleted"}})
      query2=query2.find({status:{$ne:"deleted"}})
    }
    if(req.query.category)
    {
        query=query.find({category:req.query.category})
        query2=query2.find({category:req.query.category})
    }  
    if(req.query.brand)
    {
        query=query.find({brand:req.query.brand})
        query2=query2.find({brand:req.query.brand})
    }    
    if(req.query._sort && req.query._order)
    {
        query=query.sort({[req.query._sort]:req.query._order})
    } 

    const skipCount=(req.query._page-1)*req.query._limit
    query=query.skip(skipCount)
    try{
    const doc=await query.limit(req.query._limit).exec()
    const docCount=await query2.count().exec()
    res.set('X-Total-Count',docCount)
    return res.status(201).json(doc)
    }
   catch(err)
   {
     return res.status(501).json(err)
   }
}

exports.updateProduct=async (req,res)=>
{
  const data=req.body
  const discountedPrice=(100-data.discountPercentage)*price
    try{
    const doc=await Product.findByIdAndUpdate(req.params.id,{...data,discountedPrice},{new:true})
    return res.status(201).json(doc)
    }
   catch(err)
   {
     return res.status(501).json(err)
   }
}