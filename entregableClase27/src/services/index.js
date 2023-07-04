import CartManager from "../DAO/mongo/managers/carts.js";
import CartService from "./cart.service.js";

import ProductManager from "../DAO/mongo/managers/products.js";
import ProductService from "./product.service.js";

import UserManager from "../DAO/mongo/managers/users.js";
import UserService from "./user.service.js";

export const userService = new UserService(new UserManager());
export const productService = new ProductService(new ProductManager());
export const cartService = new CartService(new CartManager());