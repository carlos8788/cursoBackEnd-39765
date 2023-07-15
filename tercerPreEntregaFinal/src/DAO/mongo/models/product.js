import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
const collection = 'Products'

const schema = new mongoose.Schema({
    title: {
        type: String,
        index: true
    },
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

schema.plugin(mongoosePaginate)

const productModel = mongoose.model(collection, schema)

export default productModel