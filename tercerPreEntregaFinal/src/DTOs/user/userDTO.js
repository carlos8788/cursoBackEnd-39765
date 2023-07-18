export default class UserDTO {
    constructor(user){
        this.id = user.id;
        this.first_name = user.first_name
        this.last_name = user.last_name
        this.email = user.email
        this.age = user.age || 1
        this.carts = user.cart || []
        this.role = user.role || 'user'
        this.password = user.password
    }
}