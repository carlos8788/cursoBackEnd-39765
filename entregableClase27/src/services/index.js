import CartManager from "../DAO/mongo/managers/carts";
import CartService from "./cart.service.js";


export const userService = new CartService(new CartManager());