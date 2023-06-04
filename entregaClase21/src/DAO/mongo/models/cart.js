import mongoose, {Schema, model} from 'mongoose';

const cartCollection = 'Carts';

const cartSchema = new Schema({

    products: {
        type:[
            {
                _id:{
                    type: mongoose.Types.ObjectId,
                    ref: 'Products'
                },
                quantity:{
                    type: Number,
                    default:1
                }
                    
            }
        ],
        default:[]
    }
});

cartSchema.pre('findOne', function(next){
    this.populate('products._id')
    next()
})

export const cartModel = model(cartCollection, cartSchema)