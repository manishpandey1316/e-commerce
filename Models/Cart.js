const mongoose= require('mongoose')
const schema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    productId:{type:mongoose.Schema.Types.ObjectId,ref:'Product',required:true},
    quantity:{type:Number,required:true,min:[1,"Price Cant' be zero"]}, 
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
const Cart = mongoose.model('Cart',schema)
exports.Cart=Cart