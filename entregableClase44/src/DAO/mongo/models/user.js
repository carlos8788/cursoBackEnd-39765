import mongoose from 'mongoose';

const collection = "Users";

const schema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    age: {
        type: Number,
        required: false
    },
    carts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Carts'
        }
    ],
    role: {
        type: String,
        default: 'user'
    },
    password: {
        type: String,
        required: false
    },
    documents: [
        {
            type: {
                type: String,
   
            },
            name: {
                type: String,
                required: true,
            },
            reference: {
                type: String,
                required: true,
            }
        },
    ],
    last_connection: {
        type: Date,
        default: Date.now,
    },

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

const messageModel = mongoose.model(collection, schema);

export default messageModel;