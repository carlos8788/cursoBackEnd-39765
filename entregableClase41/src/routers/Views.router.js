import { passportCall } from '../middleware/auth.js';
import viewsControllers from '../controllers/views.controllers.js';
import BaseRouter from "./Router.js";



export default class ViewsRouter extends BaseRouter {

    init() {
        this.get('/admin', ['ADMIN'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.getAdminView) //ADMIN
        
        this.get('/register', ['PUBLIC'], passportCall('register', {strategyType: 'login'}), viewsControllers.getRegisterView)

        this.get('/login', ['PUBLIC', 'ADMIN'], passportCall('login', {strategyType: 'login'}), viewsControllers.getLoginView)

        this.get('/', ['PUBLIC', 'ADMIN'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.getIndexView) 

        this.get('/forbidden', ['PUBLIC', 'ADMIN'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.forbiddenView) 

        this.get('/premium', ['ADMIN', 'PREMIUM'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.premiumView)

        this.get('/carts', ['AUTH', "USER", 'PREMIUM'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.getCartsView) //USER

        this.get('/viewGitHub', ['AUTH', "USER"], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.getGitHubView) //USER

        this.get('/products', ['LOGIN', "USER", 'PREMIUM'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.getProductsView) //USER

        this.get('/products/inCart', ['AUTH', "USER", 'PREMIUM'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.getProductsInCart) //USER
        
        this.get('/carts/:cid', ['AUTH', "USER", 'PREMIUM'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.getCartIdView) //USER
                
        this.get('/profile', ['AUTH', "USER", 'PREMIUM'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.getProfileView) //USER
        
        this.get('/ticket', ['AUTH', "USER", 'PREMIUM'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.getTicketView) //USER

        this.get('/allTickets', ['AUTH', "USER", 'PREMIUM'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.getAllTicketView) //USER

        this.post('/products', ['AUTH', "USER", 'PREMIUM'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.postProductsView) //USER

        this.get('/mockingproducts', ['AUTH', "USER"], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.generateProductView) //USER
        
        this.get('/restoreRequest', ['PUBLIC'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.restoreRequestView) //USER

        this.get('/restorePassword', ['NO_AUTH'], passportCall('jwt', { strategyType: "jwt" }), viewsControllers.restorePasswordView) //USER //
        
    }

}

