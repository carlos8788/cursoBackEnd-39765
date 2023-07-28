
export default class CartService {
    constructor(dao){
        this.dao = dao;
    }
    getCartsService = () => {
        return this.dao.getCarts();
    }
    getCartByIdService = (cartId) => {
        return this.dao.getCartById(cartId);
    }
    addCartService = (cart) => {
        return this.dao.addCart(cart)
    }
    addProductInCartService = (cid, productFromBody) => {
        return this.dao.addProductInCart(cid, productFromBody)
    }
    deleteProductInCartService = (cid, products) => {
        return this.dao.deleteProductInCart(cid, products)
    }
    updateProductsInCartService = (cid, products) => {
        return this.dao.updateProductsInCart(cid, products)
    }
    updateOneProductService = (cid, products) => {
        return this.dao.updateOneProduct(cid, products)
    }
    getCartsByUserService = (userId) => {
        return this.dao.getCartsByUser(userId)
    }
}