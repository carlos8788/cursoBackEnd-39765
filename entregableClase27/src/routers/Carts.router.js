
import { passportCall } from '../middleware/auth.js';
import BaseRouter from './Router.js';
import cartsController from '../controllers/carts.controller.js';

export default class CartsRouter extends BaseRouter {
    init() {

        this.get('/usercarts', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), cartsController.getUserCarts)
        // ENDPOINT Que devuelve un carrito
        this.get('/:cid', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), cartsController.getCartId)

        // ENDPOINT para crear un carrito con o sin productos
        this.post('/', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), cartsController.postCart)

        // ENDPOINT para colocar la cantidad de un producto
        this.post('/:cid/product/:pid', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), cartsController.postProductInCart)


        // ENDPOINT que actualiza la lista de productos 
        this.put('/:cid', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), cartsController.putCart)

        this.put('/:cid/product/:pid', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), cartsController.productInCart)


        // ENDPOINT que elimina un producto dado
        this.delete('/:cid/product/:pid', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), cartsController.deleteProductInCart)

        // ENDPOINT que elimina todos los productos de un carrito
        this.delete('/:cid', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), cartsController.deleteCart)

    }
};

