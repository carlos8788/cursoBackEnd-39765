export default class ProductService{
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
}