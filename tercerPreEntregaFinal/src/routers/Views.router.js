import { passportCall } from '../middleware/auth.js';
import viewsControllers from '../controllers/views.controllers.js';
import BaseRouter from "./Router.js";



let cart = []

export default class ViewsRouter extends BaseRouter {

    init() {
        this.get('/', ['PUBLIC'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.getIndexView)

        this.get('/carts', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.getCartsView)

        this.get('/viewGitHub', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.getGitHubView)

        this.get('/products', ['LOGIN'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.getProductsView)

        this.get('/products/inCart', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.getProductsInCart)
        
        this.get('/carts/:cid', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.getCartIdView)
        
        this.get('/login', ['PUBLIC'], passportCall('login', {strategyType: 'login'}), viewsControllers.getLoginView)
        
        this.get('/register', ['PUBLIC'], passportCall('register', {strategyType: 'login'}), viewsControllers.getRegisterView)
        
        this.get('/profile', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.getProfileView)

        
        this.post('/products', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.postProductsView)
        
    }

}

