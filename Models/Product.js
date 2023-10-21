const mongoose= require('mongoose')
require('mongoose-double')(mongoose);
const schema = new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true,min:[1,"Price Cant' be zero"]},
    discountPercentage:{type:Number,required:true,min:[1,"discount percentage can't be zero"]},
    discountedPrice:{type:mongoose.Schema.Types.Double},
    rating:{type:Number,default:0},
    stock:{type:Number,default:0},
    brand:{type:String,required:true},
    category:{type:String,required:true},
    thumbnail:{type:String,required:true},
    images:{type:[String],required:true},
    status:{String}
})

const virtual=schema.virtual('id')
virtual.get(function(){
    return this._id
})
schema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform:function(doc,ret){delete ret._id}

})
const Product = mongoose.model('Product',schema)
exports.Product=Product