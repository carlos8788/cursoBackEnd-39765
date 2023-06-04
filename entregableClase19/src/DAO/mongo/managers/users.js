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
            return userModel.findById({_id: id})
        } catch (error) {
            return error
        }
    }

    getUsersByEmail = (email) => {
        try {
            return userModel.findOne({email})
        } catch (error) {
            return error
        }
    }

    validateEmailPassword = (email, password) => {
        try {
            return userModel.findOne({email, password})
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
}