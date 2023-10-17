const mongoose= require('mongoose')
const schema = new mongoose.Schema({
    email:{type:String,required:true,unique:true},
    password:{type:Buffer,required:true},
    Address:{type:[mongoose.Schema.Types.Mixed],required:true},
    role:{type:String,required:true},
    salt:Buffer,
    resetToken:{type:String,default:''}
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
const User = mongoose.model('User',schema)
exports.User=User