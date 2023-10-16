const {Category}=require('../Models/Category')
exports.createCategory= async (req,res)=>
{

    const category = new Category(req.body)
    try{
        const doc=await category.save()
        return res.status(201).json(doc)
    }
   catch(err)
   {
      return res.status(501).json(err)
   }
   
}
exports.fetchCategory=async (req,res)=>
{
    try{
    const doc=await Category.find()
    return res.status(201).json(doc)
    }
   catch(err)
   {
     return res.status(501).json(err)
   }
}