const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    title: {type: String, required:true},
    description : {type: String,required:true},
    price: {type:Number,required:true},
    image:{type:String,required:true}
})

const Item = new mongoose.model("Item",itemSchema);

module.exports = Item;