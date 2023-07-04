import fs from 'fs';
import ProductManager from './ProductManager.js';

const pm = new ProductManager()

class CartManager {

    constructor() {
        
        this.carts = [];
        this.path = './src/DAO/fileSystem/carts.json';
        if (!fs.existsSync(this.path)) return this.#createFileCart(this.carts);
    };

    #createFileCart = async (file) => {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(file, null, 2));
        }
        catch (err) {
            console.log(err.message);
            return { status: 'error', message: err.message };
        }
    }

    #validateProducts = async (listProducts) => {

        let boolean = true;
        for (let product of listProducts) {
            let result = await pm.getProductById(product.id)
            console.log(result);
            if (result.status === 'error') boolean = false;
        }
        return boolean;
    };

    getCartById = async (cartId) => {
        try {
            const getCarts = await fs.promises.readFile(this.path, 'utf-8')
            this.carts = JSON.parse(getCarts);

            const findObj = this.carts.find(cart => cart.id === cartId);
            if (!findObj) return { status: 'error', message: 'ID not found' };

            return findObj;
        } catch (err) {
            console.log(err);
            return { message: err.message };
        }

    }

    addCart = async (products) => {
        try {

            const resultProducts = await this.#validateProducts(products);
            if (!resultProducts) return { status: 'error', message: 'product not found' };


            let result = await fs.promises.readFile(this.path, 'utf-8')

            if (result !== '') this.carts = JSON.parse(result);



            const cart = {
                products
            };

            (this.carts.length > 0)
                ? cart.id = this.carts[this.carts.length - 1].id + 1
                : cart.id = 1;

            this.carts.push(cart);
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
            return { status: 'success', message: 'cart send' };
        }
        catch (err) {
            console.log(err.message);
            return { status: 'error', message: err.message };
        }
    }

    addProductInCart = async (cid, productFromBody) => {

        try {
            const resultProducts = await this.#validateProducts(productFromBody);
            if (!resultProducts) return { status: 'error', message: 'product not found' };

            const cartResult = await this.getCartById(cid);

            if (cartResult.status === 'error') return cartResult


            const findObj = cartResult.products.findIndex(product => product.id === productFromBody[0].id)
            console.log(findObj, 'find product');
            if (findObj !== -1) {
                cartResult.products[findObj].quantity = Number(cartResult.products[findObj].quantity) + productFromBody[0].quantity;
                
            }
            else{
                cartResult.products.push(productFromBody[0]);
            }
            

            this.carts.map(element => {
                    if (element.id === cid) {
                        element = Object.assign(element, cartResult);
                        return element
                    }
                    return element
                })
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));

            return { status: 'success', message: 'update cart', products: cartResult };
        }
        catch (err) {
            console.log(err.message);
            return { status: 'error', message: err.message };
        }
    }


};

export default CartManager;


