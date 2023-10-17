const mongoose= require('mongoose')
const schema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},  
    orderedProducts:[new mongoose.Schema({product:{type:mongoose.Schema.ObjectId,ref:'Product'},quantity:Number})],
    paymentStatus:{type:String,required:true}, 
    paymentMethod:{type:String,required:true}, 
    deliveryAddress:{type:mongoose.Schema.Types.Mixed,required:true},
    totalItems:{type:Number,required:true},
    total:{type:Number,required:true},
    status:{type:String,default:"Pending"}
},{timestamps:true})

const virtual=schema.virtual('id')
virtual.get(function(){
    return this._id
})
schema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform:function(doc,ret){delete ret._id}

})
const Order = mongoose.model('Order',schema)
exports.Order=Order

