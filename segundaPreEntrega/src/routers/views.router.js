import { Router, response } from "express";
import ProductManager from "../DAO/mongo/managers/products.js";
const routerV = Router();
const pm = new ProductManager()

let cart = []

routerV.get('/', async (req, res) => {
    try {
        // Productos 
        const products = await pm.getProductsView();

        res.render("index", { valueReturned: products })
    }
    catch (err) {
        console.log(err);
    }

})

routerV.use('/realTimeProducts', (req, res) => {

    res.render('realTimeProducts', {})
})


routerV.get('/chat', async (req, res) => {
    res.render('chat');
})

routerV.get('/products', async (request, response) => {
    try {
        
        let { limit, page, sort, category } = request.query
        

        const options = {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            sort: { price: Number(sort) },
            lean: true
        };

        if (!(options.sort.price in [-1, 1])) {
            delete options.sort
        }


        const links = (products) => {
            let prevLink;
            let nextLink;
            if (request.originalUrl.includes('page')) {
                prevLink = products.hasPrevPage ? request.originalUrl.replace(`page=${products.page}`, `page=${products.prevPage}`) : null;
                nextLink = products.hasNextPage ? request.originalUrl.replace(`page=${products.page}`, `page=${products.nextPage}`) : null;
                return { prevLink, nextLink };
            }
            if (!request.originalUrl.includes('?')) {
                prevLink = products.hasPrevPage ? request.originalUrl.concat(`?page=${products.prevPage}`) : null;
                nextLink = products.hasNextPage ? request.originalUrl.concat(`?page=${products.nextPage}`) : null;
                return { prevLink, nextLink };
            }
            prevLink = products.hasPrevPage ? request.originalUrl.concat(`&page=${products.prevPage}`) : null;
            nextLink = products.hasNextPage ? request.originalUrl.concat(`&page=${products.nextPage}`) : null;
            return { prevLink, nextLink };

        }

        // Devuelve un array con las categorias disponibles y compara con la query "category"
        const categories = await pm.categories()

        const result = categories.some(categ => categ === category)
        if (result) {

            const products = await pm.getProducts({ category }, options);
            const { prevLink, nextLink } = links(products);
            const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs, page } = products
        
            if(page > totalPages) return response.render('notFound', {pageNotFound: '/products'})

            return response.render('products',{products: docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink, page, cart: cart.length });
        }
        
        const products = await pm.getProducts({}, options);
        
        const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products
        const { prevLink, nextLink } = links(products);
        
        if(page > totalPages) return response.render('notFound', {pageNotFound: '/products'})

        return response.render('products',{products: docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink, page, cart: cart.length });
    } catch (error) {
        console.log(error);
    }
})

routerV.post('/products', async (req, res) => {
    const product = req.body
    const findId = cart.findIndex(productCart => productCart._id === product._id);
    (findId !== -1)?cart[findId].quantity += product.quantity:cart.push(product)
    console.log(cart.length);
    return res.render('products', {cart: cart.length})
})

export default routerV