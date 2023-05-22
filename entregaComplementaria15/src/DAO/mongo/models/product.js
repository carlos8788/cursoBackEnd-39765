import mongoose from 'mongoose'

const collection = 'Products'

const schema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    code: {
        type:String,
        unique: true
    },
    stock: Number,
    status: {
        type: Boolean,
        default: true
    },
    category: String,
    thumbnails: []
})

const productModel = mongoose.model(collection, schema)

export default productModel