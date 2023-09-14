import userModel from "../models/user.js";

export default class UserManager {

    getUsers = (params) => {
        try {
            return userModel.find(params).lean();

        } catch (error) {
            return error
        }
    }
    getUsersById = (id) => {
        try {
            return userModel.findById({ _id: id })
        } catch (error) {
            return error
        }
    }

    getUsersByEmail = (email) => {
        try {
            return userModel.findOne({ email: email })
        } catch (error) {
            return error
        }
    }

    validateUser = (email) => {
        try {
            return userModel.findOne({ email: email }, { email: 1, first_name: 1, last_name: 1, password: 1, role: 1 })
        } catch (error) {
            return error
        }
    }
    createUser = (user) => {
        try {

            return userModel.create(user);
        } catch (error) {
            return error
        }
    }
    addCart = async (cart) => {
        try {
            const { userId, cartId } = cart;
            const user = await this.getUsersById(userId);
            user.carts.push(cartId);
            await user.save();
            return user;
        } catch (error) {
            return error
        }
    }

    changeRole = async (id, role) => {
        return userModel.findByIdAndUpdate({ _id: id }, { role: role })
    }

    updatePassword = async (email, password) => {
        return userModel.findOneAndUpdate({ email: email }, { password: password })
    }

    updateLastConnection = async (userId) => {
        try {
            return await userModel.findByIdAndUpdate(
                userId,
                { last_connection: Date.now() },
                { new: true }
            );
        } catch (error) {
            return error;
        }
    }
    
    updateUserDocuments = async (uid, documents) => {
        try {
            const user = await this.getUsersById(uid);
            if (!user) {
                throw new Error('User not found');
            }

            user.documents = [...(user.documents || []), ...documents];
            user.status = 'Document uploaded';

            await user.save();
            return { message: 'Documents uploaded successfully', documents };
        } catch (error) {
            return { error: error.message };
        }
    };

}