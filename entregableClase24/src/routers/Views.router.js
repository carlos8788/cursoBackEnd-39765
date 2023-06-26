


import { privacy } from "../middleware/auth.js";

import { passportCall } from "../utils.js";
import { authRoles } from '../middleware/auth.js'
import BaseRouter from "./Router.js";
import { productsService, cartsService } from "../DAO/mongo/managers/index.js";


let cart = []

export default class ViewsRouter extends BaseRouter {

    init() {
        this.get('/', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), async (req, res) => {
            try {
                // Productos 
                const products = await productsService.getProductsView();

                res.render("index", { valueReturned: products })
            }
            catch (err) {
                console.log(err);
            }

        })

        this.get('/realTimeProducts', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), (req, res) => {

            res.render('realTimeProducts', {})
        })

        this.get('/chat', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), async (req, res) => {
            res.render('chat');
        })

        this.get('/viewGitHub', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), async (req, res) => {
            const user = req.user
            res.render('viewGitHub', { user });
        })

        this.get('/products', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), authRoles('user'), async (req, res) => {
            try {

                if (!req.user) return res.status(401).redirect("/login");

                let { limit, page, sort, category } = req.query


                const options = {
                    page: Number(page) || 1,
                    limit: Number(limit) || 10,
                    sort: { price: Number(sort) },
                    lean: true
                };

                if (!(options.sort.price === -1 || options.sort.price === 1)) {
                    delete options.sort
                }


                const links = (products) => {
                    let prevLink;
                    let nextLink;
                    if (req.originalUrl.includes('page')) {
                        prevLink = products.hasPrevPage ? req.originalUrl.replace(`page=${products.page}`, `page=${products.prevPage}`) : null;
                        nextLink = products.hasNextPage ? req.originalUrl.replace(`page=${products.page}`, `page=${products.nextPage}`) : null;
                        return { prevLink, nextLink };
                    }
                    if (!req.originalUrl.includes('?')) {
                        prevLink = products.hasPrevPage ? req.originalUrl.concat(`?page=${products.prevPage}`) : null;
                        nextLink = products.hasNextPage ? req.originalUrl.concat(`?page=${products.nextPage}`) : null;
                        return { prevLink, nextLink };
                    }
                    prevLink = products.hasPrevPage ? req.originalUrl.concat(`&page=${products.prevPage}`) : null;
                    nextLink = products.hasNextPage ? req.originalUrl.concat(`&page=${products.nextPage}`) : null;
                    return { prevLink, nextLink };

                }

                // Devuelve un array con las categorias disponibles y compara con la query "category"
                const categories = await productsService.categories()

                const result = categories.some(categ => categ === category)
                if (result) {

                    const products = await productsService.getProducts({ category }, options);
                    const { prevLink, nextLink } = links(products);
                    const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs, page } = products

                    if (page > totalPages) return res.render('notFound', { pageNotFound: '/products' })

                    return res.render('products', { products: docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink, page, cart: cart.length });
                }

                const products = await productsService.getProducts({}, options);

                const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products
                const { prevLink, nextLink } = links(products);

                if (page > totalPages) return res.render('notFound', { pageNotFound: '/products' })
                console.log(req.user);
                return res.render(
                    'products',
                    {
                        products: docs,
                        totalPages,
                        prevPage,
                        nextPage,
                        hasNextPage,
                        hasPrevPage,
                        prevLink,
                        nextLink,
                        page,
                        cart: cart.length,
                        user: req.user
                    }
                );
            } catch (error) {
                console.log(error);
            }
        })

        this.get('/products/inCart', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), async (req, res) => {

            const productsInCart = await Promise.all(cart.map(async (product) => {
                const productDB = await productsService.getProductById(product._id);
                return { title: productDB.title, quantity: product.quantity }
            }))

            return res.send({ cartLength: cart.length, productsInCart })
        })

        this.post('/products', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), async (req, res) => {
            try {
                const { product, finishBuy } = req.body

                if (product) {
                    if (product.quantity > 0) {
                        const findId = cart.findIndex(productCart => productCart._id === product._id);
                        (findId !== -1) ? cart[findId].quantity += product.quantity : cart.push(product)
                    }
                    else {
                        return res.render('products', { message: 'Quantity must be greater than 0' })
                    }
                }
                if (finishBuy) {
                    console.log(cart);
                    const createdCart = await cartsService.addCart(cart)
                    console.log(createdCart);
                    cart.splice(0, cart.length)
                }

                return res.render('products')
            } catch (error) {
                console.log(error);
            }
        })

        this.get('/carts/:cid', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), async (req, res) => {
            try {
                const { cid } = req.params

                const result = await cartsService.getCartById(cid)

                if (result === null || typeof (result) === 'string') return res.render('cart', { result: false, message: 'ID not found' });

                return res.render('cart', { result });


            } catch (err) {
                console.log(err);
            }

        })

        this.get('/login', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), (req, res) => {
            res.render('login')
        })

        this.get('/register', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), privacy('NO_AUTHENTICATED'), (req, res) => {
            res.render('registerForm')
        })

        this.get('/profile', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), privacy('PRIVATE'), (req, res) => {
            try {
                delete req.user.password
                console.log(req.user, 'profile');
                res.render('profile', { user: req.user })

            } catch (error) {
                console.log(error);
            }
        })

    }

}

