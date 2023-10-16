const {Brand}=require('../Models/Brand')

exports.createBrand= async (req,res)=>
{

    const brand = new Brand(req.body)
    try{
        const doc=await brand.save()
        return res.status(201).json(doc)
    }
   catch(err)
   {
      return res.status(501).json(err)
   }
   
}
exports.fetchBrand=async (req,res)=>
{
    try{
    const doc=await Brand.find()
    return res.status(201).json(doc)
    }
   catch(err)
   {
     return res.status(501).json(err)
   }
}