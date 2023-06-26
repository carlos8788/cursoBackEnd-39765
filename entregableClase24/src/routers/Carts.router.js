import { cartsService, productsService } from '../DAO/mongo/managers/index.js';
import { passportCall } from '../utils.js';
import BaseRouter from './Router.js';


export default class CartsRouter extends BaseRouter {
    init() {
        // ENDPOINT Auxiliar para corroborar todos los carritos y hacer diferentes pruebas
        this.get('/',['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), async (req, res) => {
            const result = await cartsService.getCarts()
            return res.status(200).send(result)
        })

        // ENDPOINT Que devuelve un carrito
        this.get('/:cid',['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), async (req, res) => {
            try {
                const { cid } = req.params

                const result = await cartsService.getCartById(cid)

                // Si el resultado del GET tiene la propiedad 'CastError' devuelve un error
                if (result === null || typeof (result) === 'string') return res.status(404).send({ status: 'error', message: 'ID not found' });


                // Resultado
                return res.status(200).send(result);
            } catch (err) {
                console.log(err);
            }

        })

        // ENDPOINT para crear un carrito con o sin productos
        this.post('/',['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), async (req, res) => {
            try {
                const { products } = req.body


                if (!Array.isArray(products)) return res.status(400).send({ status: 'error', message: 'TypeError' });

                // Corroborar si todos los ID de los productos existen
                const results = await Promise.all(products.map(async (product) => {
                    const checkId = await productsService.getProductById(product._id);
                    if (checkId === null || typeof (checkId) === 'string') return res.status(404).send({ status: 'error', message: `The ID product: ${product._id} not found` })
                }))

                const check = results.find(value => value !== undefined)
                if (check) return res.status(404).send(check)

                const cart = await cartsService.addCart(products)


                res.status(200).send(cart);

            }
            catch (err) {
                console.log(err);
            }
        })

        // ENDPOINT para colocar la cantidad de un producto
        this.post('/:cid/product/:pid',['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), async (req, res) => {
            try {

                let { cid, pid } = req.params
                const { quantity } = req.body

                if (isNaN(Number(quantity)) || !Number.isInteger(quantity)) return res.status(400).send({ status: 'error', payload: null, message: 'The quantity is not valid' })

                if (quantity < 1) return res.status(400).send({ status: 'error', payload: null, message: 'The quantity must be greater than 1' })

                const checkIdProduct = await productsService.getProductById(pid);


                if (checkIdProduct === null || typeof (checkIdProduct) === 'string') return res.status(404).send({ status: 'error', message: `The ID product: ${pid} not found` })

                const checkIdCart = await cartsService.getCartById(cid)

                if (checkIdCart === null || typeof (checkIdCart) === 'string') return res.status(404).send({ status: 'error', message: `The ID cart: ${cid} not found` })

                const result = await cartsService.addProductInCart(cid, { _id: pid, quantity })

                return res.status(200).send({ message: `added product ID: ${pid}, in cart ID: ${cid}`, cart: result });

            } catch (error) {
                console.log(error);
            }
        })


        // ENDPOINT que actualiza la lista de productos 
        this.put('/:cid',['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), async (req, res) => {
            try {
                const { cid } = req.params
                const { products } = req.body

                const results = await Promise.all(products.map(async (product) => {
                    const checkId = await productsService.getProductById(product._id);

                    if (checkId === null || typeof (checkId) === 'string') {
                        return res.status(404).send({ status: 'error', message: `The ID product: ${product._id} not found` })
                    }
                }))
                const check = results.find(value => value !== undefined)
                if (check) return res.status(404).send(check)


                const checkIdCart = await cartsService.getCartById(cid)
                if (checkIdCart === null || typeof (checkIdCart) === 'string') return res.status(404).send({ status: 'error', message: `The ID cart: ${cid} not found` })

                const cart = await cartsService.updateProductsInCart(cid, products)
                return res.status(200).send({ status: 'success', payload: cart })
            } catch (error) {
                console.log(error);
            }

        })

        this.put('/:cid/product/:pid',['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), async (req, res) => {
            try {

                let { cid, pid } = req.params
                const { quantity } = req.body

                console.log(quantity, 'quantity');
                const checkIdProduct = await productsService.getProductById(pid);
                console.log('checkIdProduct', checkIdProduct);
                if (checkIdProduct === null || typeof (checkIdProduct) === 'string') return res.status(404).send({ status: 'error', message: `The ID product: ${pid} not found` })

                const checkIdCart = await cartsService.getCartById(cid)

                console.log('checkIdCart', checkIdCart);
                if (checkIdCart === null || typeof (checkIdCart) === 'string') return res.status(404).send({ error: `The ID cart: ${cid} not found` })

                const result = checkIdCart.products.findIndex(product => product._id._id.toString() === pid)
                console.log('result', result);

                if (result === -1) return res.status(404).send({ status: 'error', payload: null, message: `the product with ID: ${pid} cannot be updated because it is not in the cart` })

                if (isNaN(Number(quantity)) || !Number.isInteger(quantity)) return res.status(400).send({ status: 'error', payload: null, message: 'The quantity is not valid' })

                if (quantity < 1) return res.status(400).send({ status: 'error', payload: null, message: 'The quantity must be greater than 1' })

                checkIdCart.products[result].quantity = quantity


                const cart = await cartsService.updateOneProduct(cid, checkIdCart.products)
                res.status(200).send({ status: 'success', cart })

            } catch (error) {
                console.log(error);
            }
        })


        // ENDPOINT que elimina un producto dado
        this.delete('/:cid/product/:pid',['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), async (req, res) => {
            try {

                const { cid, pid } = req.params

                const checkIdProduct = await productsService.getProductById(pid);

                if (checkIdProduct === null || typeof (checkIdProduct) === 'string') return res.status(404).send({ status: 'error', message: `The ID product: ${pid} not found` })

                const checkIdCart = await cartsService.getCartById(cid)
                if (checkIdCart === null || typeof (checkIdCart) === 'string') return res.status(404).send({ status: 'error', message: `The ID cart: ${cid} not found` })

                const findProduct = checkIdCart.products.findIndex((element) => element._id._id.toString() === checkIdProduct._id.toString())

                if (findProduct === -1) return res.status(404).send({ error: `The ID product: ${pid} not found in cart` })

                checkIdCart.products.splice(findProduct, 1)

                const cart = await cartsService.deleteProductInCart(cid, checkIdCart.products)

                return res.status(200).send({ status: 'success', message: `deleted product ID: ${pid}`, cart })
            } catch (error) {
                console.log(err);
            }
        })

        // ENDPOINT que elimina todos los productos de un carrito
        this.delete('/:cid',['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), async (req, res) => {
            try {
                const { cid } = req.params
                const checkIdCart = await cartsService.getCartById(cid)

                if (checkIdCart === null || typeof (checkIdCart) === 'string') return res.status(404).send({ error: `The ID cart: ${cid} not found` })

                if (checkIdCart.products.length === 0) return res.status(404).send({ status: 'error', payload: null, message: 'The cart is already empty' })

                checkIdCart.products = []

                const cart = await cartsService.updateOneProduct(cid, checkIdCart.products)
                return res.status(200).send({ status: 'success', message: `the cart whit ID: ${cid} was emptied correctly `, cart });

            } catch (error) {
                console.log(error);
            }
        })
    }
};

