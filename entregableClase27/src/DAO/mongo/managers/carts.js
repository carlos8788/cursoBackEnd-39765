import { cartModel } from "../models/cart.js";


class CartManager {


    getCarts = async () => {
        try {
            return await cartModel.find()
        } catch (err) {
            console.log(err);
        }
    };

    getCartById = async (cartId) => {
        try {

            return await cartModel.findOne({ _id: cartId }).lean()

        } catch (err) {
            return err.message
        }

    }

    addCart = async (cart) => {
        
        try {
            const { userId, products } = cart
            const cartCreated = await cartModel.create({user: userId})
            products.forEach(product => cartCreated.products.push(product));
            cartCreated.save()
            return cartCreated

        }
        catch (err) {
            
            return err.message;

        }
    }

    addProductInCart = async (cid, productFromBody) => {

        try {
            const cart = await cartModel.findOne({ _id: cid })
            const findProduct = cart.products.some(
                (product) => product._id._id.toString() === productFromBody._id)

            if (findProduct) {
                await cartModel.updateOne(
                    { _id: cid, "products._id": productFromBody._id },
                    { $inc: { "products.$.quantity": productFromBody.quantity } })
                return await cartModel.findOne({ _id: cid })
            }

            await cartModel.updateOne(
                { _id: cid },
                {
                    $push: {
                        products: {
                            _id: productFromBody._id,
                            quantity: productFromBody.quantity
                        }
                    }
                })
            return await cartModel.findOne({ _id: cid })


        }

        catch (err) {
            console.log(err.message);
            return err

        }
    }

    deleteProductInCart = async (cid, products) => {
        try {
            return await cartModel.findOneAndUpdate(
                { _id: cid },
                { products },
                { new: true })

        } catch (err) {
            return err
        }

    }

    updateProductsInCart = async (cid, products) => {
        try {
            return await cartModel.findOneAndUpdate(
                { _id: cid },
                { products },
                { new: true })

        } catch (err) {
            return err
        }
    }

    updateOneProduct = async (cid, products) => {
        
        await cartModel.updateOne(
            { _id: cid },
            {products})
        return await cartModel.findOne({ _id: cid })
    }

    getCartsByUser = async (userId) => {
        try {
            return await cartModel.find({user: userId})
        } catch (error) {
            return error
        }
    }


};

export default CartManager;


