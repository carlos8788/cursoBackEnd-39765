export default class UserService{
    constructor(dao){
        this.dao = dao;
    }
    getUsersService = (params) => {
        return this.dao.getUsers(params)
    }
    getUsersByIdService = (id) => {
        return this.dao.getUsersById(id)
    }
    getUsersByEmailService = (email) => {
        return this.dao.getUsersByEmail(email)
    }
    validateUserService = (email) => {
        return this.dao.validateUser(email)
    }
    createUserService = (user) => {
        return this.dao.createUser(user)
    }
    addCartService = (cart) => {
        return this.dao.addCart(cart)
    }

    changeUserService = (id, role) => {
        return this.dao.changeRole(id, role)
    }

    updatePasswordService = (email, password) => {
        return this.dao.updatePassword(email, password);
    }

    updateLastConnectionService = (id) => {
        return this.dao.updateLastConnection(id);
    }

    updateUserDocumentsService = (uid, type, documents) => {
        return this.dao.updateUserDocuments(uid, type, documents);
    }

    getUserDocumentsService = (id) => {
        return this.dao.getDocuments(id)
    }
}