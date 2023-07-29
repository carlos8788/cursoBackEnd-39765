import { productService, cartService, ticketsService } from "../services/index.js";
import { generateUser } from "../utils/dataFaker.js";
import CustomError from '../services/errors/customErrors.js'
import EErrors from '../services/errors/enums.js';
import { generateProductErrorInfo } from '../services/errors/constant.js';

const cart = []

const getIndexView = async (req, res) => {
    try {
        
        const products = await productService.getProductsViewService();
        req.logger.debug('GET INDEX OK')
        res.render("index", { valueReturned: products, isLoggedIn: req.user });
    }
    catch (error) {
        req.logger.error(error)        
    }

}

const getCartsView = async (req, res) => {
    req.logger.debug('Use carts view OK')
    res.render('userCarts', { isLoggedIn: req.user });
}

const getGitHubView = async (req, res) => {
    const user = req.user
    res.render('viewGitHub', { user, isLoggedIn: req.user });
}

const getProductsView = async (req, res) => {
    try {

        let { limit, page, sort, category } = req.query

        const options = {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            sort: { price: Number(sort) },
            lean: true
        };

        if (!req.user) return res.status(401).redirect("/login");

        let carrito = await cartService.getCartsByUserService(req.user.id)

        if (carrito.length === 0) {

            carrito = await cartService.addCartService({ userId: req.user.id, products: [] })
        }




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
        const categories = await productService.categoriesService()

        const result = categories.some(categ => categ === category)
        if (result) {

            const products = await productService.getProductsService({ category }, options);
            const { prevLink, nextLink } = links(products);
            const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs, page } = products

            if (page > totalPages) {
                req.logger.warning('Page Not Found')
                return res.render('notFound', { pageNotFound: '/', isLoggedIn: req.user })
            }

            return res.render('products', { products: docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink, page, cart: cart.length, isLoggedIn: req.user });
        }

        const products = await productService.getProductsService({}, options);

        const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products
        const { prevLink, nextLink } = links(products);

        if (page > totalPages) {
            req.logger.warning('Page Not Found')
            return res.render('notFound', { pageNotFound: '/', isLoggedIn: req.user })
        }
        req.logger.debug('Products view OK')
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
                page: options.page,
                cart: cart.length,
                user: req.user,
                isLoggedIn: req.user
            }
        );
        
    } catch (error) {
        req.logger.error(error)
    }
}

const getProductsInCart = async (req, res) => {
    try {

        const productsInCart = await cartService.getCartByIdService(req.user.cart)


        if (!productsInCart) return res.send({ cartLength: 0, productsInCart: [] })

        return res.send({ cartLength: productsInCart.products.length, productsInCart: productsInCart.products })

    } catch (error) {
        console.log(error);
        return res.sendInternalError(error);
    }
}

const postProductsView = async (req, res) => {
    try {

        const userId = req.user.id;
        const cartId = req.user.cart
        const { product } = req.body;


        if (product) {
            if (product.quantity > 0) {

                const updateCart = await cartService.addProductInCartService(cartId, product)

                // return res.send({ cartLength: updateCart.products.length, productsInCart:updateCart.products})
            }
            else {
                return res.render('products', { message: 'Quantity must be greater than 0', })
            }
        }
        req.logger.debug('post products view OK')
        return res.render('products', { isLoggedIn: req.user })
    } catch (error) {

        req.logger.error(error)
        return res.sendInternalError(error)
    }
}

const getCartIdView = async (req, res) => {
    try {
        const { cid } = req.params

        const result = await cartService.getCartByIdService(cid)

        const subtotal_producto = []
        result.products.forEach(product => {
            const subtotal = product._id.price * product.quantity
            let prod = {
                name: product._id.title,
                subtotal
            }
            subtotal_producto.push(prod)

        })

        if (result === null || typeof (result) === 'string') return res.render('cart', { result: false, message: 'ID not found' });

        return res.render('cart', { result, isLoggedIn: req.user });


    } catch (error) {
        req.logger.error(error)
        return res.sendInternalError(error)
    }

}

const getLoginView = (req, res) => {
    try {
        if (req.user) return res.redirect('/products')
        return res.render('login', { isLoggedIn: req.user })

    } catch (error) {
        req.logger.error(error)
        return res.sendInternalError(error)
    }
}

const getRegisterView = (req, res) => {
    try {
        if (req.user) return res.redirect('/products')
        return res.render('registerForm', { isLoggedIn: req.user })

    } catch (error) {
        req.logger.error(error)
        return res.sendInternalError(error)
    }
}

const getProfileView = (req, res) => {
    try {
        delete req.user.password

        res.render('profile', { user: req.user, isLoggedIn: req.user })

    } catch (error) {
        req.logger.error(error)
        return res.sendInternalError(error)
    }
}

const getTicketView = (req, res) => {
    try {

        const logged = Object.values(req.user).every(property => property)

        return res.render('ticket', { isLoggedIn: logged, user: req.user });
    } catch (error) {
        req.logger.error(error)
        return res.sendInternalError(error)
    }
}

const getAllTicketView = (req, res) => {
    try {
        const logged = Object.values(req.user).every(property => property)
        return res.render('allTickets', { isLoggedIn: logged, user: req.user });
    } catch (error) {
        req.logger.error(error)
        return res.sendInternalError(error)

    }
}

const getAdminView = (req, res) => {
    try {

        const logged = Object.values(req.user).every(property => property)
        return res.render('admin', { isLoggedIn: logged });
    } catch (error) {
        req.logger.error(error)
        return res.sendInternalError(error)
    }
}

const forbiddenView = (req, res) => {
    req.logger.warning('WARNING FORBIDDEN')
    res.render('forbidden');
}

const generateProductView = (req, res) => {
    try {
        let users = [];
        for (let i = 0; i < 100; i++) {
            users.push(generateUser())

        }
        res.send({ status: "success", users: users });
    } catch (error) {
        req.logger.error(error)
        return res.sendInternalError(error)
    }

}


export default {
    getIndexView,
    getCartsView,
    getGitHubView,
    getProductsView,
    getProductsInCart,
    postProductsView,
    getCartIdView,
    getLoginView,
    getRegisterView,
    getProfileView,
    getTicketView,
    getAllTicketView,
    getAdminView,
    forbiddenView,
    generateProductView
}