import mongoose, { Schema, model } from 'mongoose';

const cartCollection = 'Carts';

const cartSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products: {
        type: [
            {
                _id: {
                    type: mongoose.Types.ObjectId,
                    ref: 'Products'
                },
                quantity: {
                    type: Number,
                    default: 1
                }

            }
        ],
        default: []
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

cartSchema.pre('findOne', function (next) {
    this.populate('products._id')
    next()
})

export const cartModel = model(cartCollection, cartSchema)