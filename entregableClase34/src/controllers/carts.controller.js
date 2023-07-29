import { userService, productService, cartService, ticketsService } from '../services/index.js'

const getUserCarts = async (req, res) => {

    try {
        req.logger.debug(`User-> ${req.user.id}`)
        const carts = await cartService.getCartsByUserService(req.user.id)
        

        return res.sendSuccessWithPayload(carts[0])
    } catch (error) {
        req.logger.error(error)
        return res.sendInternalError(error)
    }
}

const getCartId = async (req, res) => {
    try {
        const { cid } = req.params
        

        const result = await cartService.getCartByIdService(cid)
        
        // Si el resultado del GET tiene la propiedad 'CastError' devuelve un error
        if (result === null || typeof (result) === 'string') {
            req.logger.warning('ID not found')
            return res.status(404).send({ status: 'error', message: 'ID not found' });
        }


        // Resultado
        req.logger.info('getCartId OK')
        return res.sendSuccessWithPayload(result);
    } catch (error) {
        req.logger.error(error)
        return res.sendInternalError(error)
    }

}

const postCart = async (req, res) => {
    try {
        const { products, userId } = req.body

        const user = await userService.getUsersByIdService(userId)


        if (!Array.isArray(products)) {
            req.logger.warning('Type Error')
            return res.sendNotFound({ status: 'error', message: 'TypeError' })};

        // Corroborar si todos los ID de los productos existen
        const results = await Promise.all(products.map(async (product) => {
            const checkId = await productService.getProductByIdService(product._id);
            if (checkId === null || typeof (checkId) === 'string') return `The ID product: ${product._id} not found`
        }))

        const check = results.find(value => value !== undefined)
        if (check) {
            req.logger.warning('Not found')
            return res.sendNotFound(check)}

        const cart = await cartService.addCartService({ userId, products })

        const addCartInUser = await userService.addCartService({ userId: cart.user, cartId: cart._id })
        
        req.logger.info('postCart OK')
        
        return res.sendSuccess(cart);

    }
    catch (error) {
        req.logger.error(error.message)
        return res.sendInternalError(error.message)

    }
}

const postProductInCart = async (req, res) => {
    try {

        let { cid, pid } = req.params
        const { quantity } = req.body

        if (isNaN(Number(quantity)) || !Number.isInteger(quantity)) return res.status(400).send({ status: 'error', payload: null, message: 'The quantity is not valid' })

        if (quantity < 1) return res.status(400).send({ status: 'error', payload: null, message: 'The quantity must be greater than 1' })

        const checkIdProduct = await productService.getProductByIdService(pid);


        if (checkIdProduct === null || typeof (checkIdProduct) === 'string') return res.status(404).send({ status: 'error', message: `The ID product: ${pid} not found` })

        const checkIdCart = await cartService.getCartByIdService(cid)

        if (checkIdCart === null || typeof (checkIdCart) === 'string') return res.status(404).send({ status: 'error', message: `The ID cart: ${cid} not found` })

        const result = await cartService.addProductInCartService(cid, { _id: pid, quantity })
        req.logger.debug('Post product in cart OK')
        return res.status(200).send({ message: `added product ID: ${pid}, in cart ID: ${cid}`, cart: result });

    } catch (error) {
        req.logger.error(error)
        return res.sendInternalError(error)
    }
}

const putCart = async (req, res) => {
    try {
        const { cid } = req.params
        const { products } = req.body

        const results = await Promise.all(products.map(async (product) => {
            const checkId = await productService.getProductByIdService(product._id);

            if (checkId === null || typeof (checkId) === 'string') {
                return res.status(404).send({ status: 'error', message: `The ID product: ${product._id} not found` })
            }
        }))
        const check = results.find(value => value !== undefined)
        if (check) return res.status(404).send(check)


        const checkIdCart = await cartService.getCartByIdService(cid)
        if (checkIdCart === null || typeof (checkIdCart) === 'string') return res.status(404).send({ status: 'error', message: `The ID cart: ${cid} not found` })
        req.logger.debug('Put cart OK')
        const cart = await cartService.updateProductsInCartService(cid, products)
        return res.status(200).send({ status: 'success', payload: cart })
    } catch (error) {
        req.logger.error(error)
        return res.sendInternalError(error)
    }

}

const productInCart = async (req, res) => {
    try {

        let { cid, pid } = req.params
        const { quantity } = req.body


        const checkIdProduct = await productService.getProductByIdService(pid);

        if (checkIdProduct === null || typeof (checkIdProduct) === 'string') return res.status(404).send({ status: 'error', message: `The ID product: ${pid} not found` })

        const checkIdCart = await cartService.getCartByIdService(cid)


        if (checkIdCart === null || typeof (checkIdCart) === 'string') return res.status(404).send({ error: `The ID cart: ${cid} not found` })

        const result = checkIdCart.products.findIndex(product => product._id._id.toString() === pid)


        if (result === -1) return res.status(404).send({ status: 'error', payload: null, message: `the product with ID: ${pid} cannot be updated because it is not in the cart` })

        if (isNaN(Number(quantity)) || !Number.isInteger(quantity)) return res.status(400).send({ status: 'error', payload: null, message: 'The quantity is not valid' })

        if (quantity < 1) return res.status(400).send({ status: 'error', payload: null, message: 'The quantity must be greater than 1' })

        checkIdCart.products[result].quantity = quantity

        req.logger.debug('Product in cart OK')
        const cart = await cartService.updateOneProduct(cid, checkIdCart.products)
        res.status(200).send({ status: 'success', cart })

    } catch (error) {
        req.logger.error(error)
        return res.sendInternalError(error)
    }
}

const deleteProductInCart = async (req, res) => {
    try {

        const { cid, pid } = req.params

        const checkIdProduct = await productService.getProductByIdService(pid);

        if (checkIdProduct === null || typeof (checkIdProduct) === 'string') return res.status(404).send({ status: 'error', message: `The ID product: ${pid} not found` })

        const checkIdCart = await cartService.getCartByIdService(cid)
        if (checkIdCart === null || typeof (checkIdCart) === 'string') return res.status(404).send({ status: 'error', message: `The ID cart: ${cid} not found` })

        const findProduct = checkIdCart.products.findIndex((element) => element._id._id.toString() === checkIdProduct._id.toString())

        if (findProduct === -1) return res.status(404).send({ error: `The ID product: ${pid} not found in cart` })

        checkIdCart.products.splice(findProduct, 1)

        const cart = await cartService.deleteProductInCartService(cid, checkIdCart.products)
        req.logger.debug('Delete product in Cart OK')
        return res.status(200).send({ status: 'success', message: `deleted product ID: ${pid}`, cart })
    } catch (error) {
        req.logger.error(error)
        
        return res.sendInternalError(error)
    }
}

const deleteCart = async (req, res) => {
    try {
        const { cid } = req.params
        const checkIdCart = await cartService.getCartByIdService(cid)

        if (checkIdCart === null || typeof (checkIdCart) === 'string') return res.status(404).send({ error: `The ID cart: ${cid} not found` })

        if (checkIdCart.products.length === 0) return res.status(404).send({ status: 'error', payload: null, message: 'The cart is already empty' })

        checkIdCart.products = []
        req.logger.debug('Delete OK')
        const cart = await cartService.updateOneProduct(cid, checkIdCart.products)
        return res.status(200).send({ status: 'success', message: `the cart whit ID: ${cid} was emptied correctly `, cart });

    } catch (error) {
        req.logger.error(error)
        return res.sendInternalError(error)
    }
}

const purchaseCart = async (req, res) => {
    try {
        const cid = req.params.cid
        const { amount } = req.body
        const cart = await cartService.getCartByIdService(cid)

        let insufficientProducts = [];
        let productPurchase = [];

        for (let product of cart.products) {
            if (product._id.stock <= product.quantity) {
                insufficientProducts.push(product);
            } else {
                product._id.stock -= product.quantity
                await productService.updateProductService(product._id._id, product._id)
                productPurchase.push(product);
            }
        }

        amount = Number(amount.toFixed(2))

        const preTicket = {
            user: req.user.id,
            cart: cid,
            amount
        }

        if (!amount) return res.status(403).send({ message: 'Products not available' });
        await ticketsService.addTicketService(preTicket)
        await cartService.updateProductsInCartService(cid, insufficientProducts)
        req.logger.debug('Purchase OK')
        return res.sendSuccess('Successful purchase')
    } catch (error) {
        req.logger.error(error)
        return res.sendInternalError(error)
    }

};


export default {
    getUserCarts,
    getCartId,
    postCart,
    postProductInCart,
    putCart,
    productInCart,
    deleteProductInCart,
    deleteCart,
    purchaseCart
}