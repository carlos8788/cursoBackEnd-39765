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
    }

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

const messageModel = mongoose.model(collection, schema);

export default messageModel;