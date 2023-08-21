import CartManager from './carts.js';
import ProductManager from './products.js';
import UserManager from './users.js';


export const usersService = new UserManager();
export const productsService = new ProductManager();
export const cartsService = new CartManager();
