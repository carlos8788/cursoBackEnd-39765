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


    updateUserDocuments = async (uid, type, documents) => {
        
        try {
            if (type === 'profile' || type === 'document') {
                const entity = await this.getUsersById(uid);

                if (type === 'profile') {
                    const profileIndex = entity.documents.findIndex(doc => doc.type === 'profile');

                    if (profileIndex !== -1) {
                        entity.documents[profileIndex] = {...documents[0], type: 'profile' };
                        
                    } else {
                        entity.documents.push({ ...documents[0], type: 'profile' });
                    }
                }
                else {
                    documents.forEach((doc) => {

                        const allowedDocTypes = [
                            "dni",
                            "domicilio",
                            "cuenta"
                        ];

                        if (allowedDocTypes.includes(doc.type)) {

                            const docIndex = entity.documents.findIndex(existingDoc => existingDoc.type === doc.type);

                            if (docIndex !== -1) {
                                entity.documents[docIndex] = doc;
                            } else {
                                entity.documents.push(doc);
                            }
                        }
                        else {
                            throw new Error(`Invalid document type: ${doc.type}`);
                        }
                    });
                }

                // entity.documents = []

                await entity.save();
                return { message: 'Documents updated successfully' };
            } else {
                throw new Error('Invalid type parameter');
            }
        } catch (error) {
            
            throw error;
        }
    };

    getDocuments = async (uid) => {
        try {
            const user = await userModel.findById({_id: uid})
            
            return user.documents
            
        } catch (error) {
            return error
        }
    }

}