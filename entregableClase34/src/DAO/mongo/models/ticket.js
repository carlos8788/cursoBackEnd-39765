import mongoose, { Schema, model } from 'mongoose';
// import moment from 'moment';

const ticketCollection = 'Tickets';

const ticketSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    code: {
        type: String,
        unique: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    amount: {
        type: Number,
    },
    purchaser: {
        type: String,
    },
    count: {
        type: Number,
        default: 0,
    },
    

}, { timestamps: { createdAt: 'purchase_time', updatedAt: 'updated_at' } }
);

ticketSchema.pre('save', async function (next) {

    if (this.isNew) {
        try {

            const user = await this.model('Users').findById(this.user);

            this.purchaser = user.email;

            const count = await this.model('Tickets').countDocuments();

            this.code = `${user.email}.${count + 1}/${this._id}`;
            
            
            this.count = count + 1;
            

            next();

        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});




export const ticketModel = model(ticketCollection, ticketSchema)


