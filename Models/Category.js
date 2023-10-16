const mongoose= require('mongoose')
const schema = new mongoose.Schema({
    value:{type:String,required:true},
    label:{type:String,required:true},
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
const Category = mongoose.model('Category',schema)
exports.Category=Category