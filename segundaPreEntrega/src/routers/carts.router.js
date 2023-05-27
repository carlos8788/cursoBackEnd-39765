import { Router, request, response } from 'express';
import CartManager from '../DAO/mongo/managers/carts.js';
import ProductManager from '../DAO/mongo/managers/products.js';

const routerC = Router()

const cm = new CartManager()
const pm = new ProductManager()

routerC.get('/', async (request, response) => {
    const result = await cm.getCarts()
    return response.status(200).send(result)
})

routerC.get('/:cid', async (request, response) => {
    try {
        const { cid } = request.params
        
        const result = await cm.getCartById(cid)
        console.log(result);
        // Si el resultado del GET tiene la propiedad 'CastError' devuelve un error
        if (!result) return response.status(404).send({ message: 'ID not found' });
        

        // Resultado
        return response.status(200).send(result);
    } catch (err) {
        console.log(err);
    }

})


routerC.post('/', async (request, response) => {
    try {
        const { products } = request.body

        if (!Array.isArray(products)) return response.status(400).send({ status: 'error', message: 'TypeError' });

        // Corroborar si todos los ID de los productos existen
        const results = await Promise.all(products.map(async (product) => {
            const checkId = await pm.getProductById(product._id);
            if ('error' in checkId) {
                return {error: checkId.error, _id:product._id}
            }
        }))
        const check = results.find(value => value !== undefined)
        if (check) return response.status(404).send(check)

        const cart = await cm.addCart(products)
        
                
        response.status(200).send(cart);

    }
    catch (err) {
        console.log(err);
    }
})

routerC.post('/:cid/product/:pid', async (request, response) => {
    try {
        
        let { cid, pid } = request.params
        const { quantity } = request.body
        
        if (isNaN(Number(quantity))||!Number.isInteger(quantity)) return response.status(400).send({status:'error', payload:null, message: 'The quantity is not valid'})
        
        if (quantity < 1) return response.status(400).send({status:'error', payload:null, message:'The quantity must be greater than 1'})
        
        const checkIdProduct = await pm.getProductById(pid);
        if ('error' in checkIdProduct) return response.status(404).send({error: `The ID product: ${pid} not found`})
    
        const checkIdCart = await cm.getCartById(cid)
        if ('reason' in checkIdCart) return response.status(404).send({error: `The ID cart: ${cid} not found`})
    
        const result = await cm.addProductInCart(cid, { _id: pid, quantity })
        
        return response.status(200).send({message:`added product ID: ${pid}, in cart ID: ${cid}`, cart: result});

    } catch (error) {
        console.log(err);
    }
})

routerC.delete('/:cid/product/:pid', async (request, response) =>{
    try {
        
        const { cid, pid } = request.params
        const checkIdProduct = await pm.getProductById(pid);
        if ('error' in checkIdProduct) return response.status(404).send({error: `The ID product: ${pid} not found`})
    
        const checkIdCart = await cm.getCartById(cid)
        if ('reason' in checkIdCart) return response.status(404).send({error: `The ID cart: ${cid} not found`})
        
        const findProduct = checkIdCart.products.findIndex((element) => element._id._id.toString() === checkIdProduct._id.toString())
    
        if(findProduct === -1) return response.status(404).send({error: `The ID product: ${pid} not found in cart`})
        
        checkIdCart.products.splice(findProduct, 1)
        
        const cart = await cm.deleteProductInCart(cid, checkIdCart.products)    
    
        return response.status(200).send({status:'success', message:`deleted product ID: ${pid}`, cart })
    } catch (error) {
        console.log(err);
    }
})

routerC.put('/:cid', async (request, response) =>{
    try {
        const { cid } = request.params
        const {products} = request.body

        const results = await Promise.all(products.map(async (product) => {
            const checkId = await pm.getProductById(product._id);
            if ('error' in checkId) {
                return {error: checkId.error, _id:product._id}
            }
        }))
        const check = results.find(value => value !== undefined)
        if (check) return response.status(404).send(check)

    
        const checkIdCart = await cm.getCartById(cid)
        if ('reason' in checkIdCart) return response.status(404).send({error: `The ID cart: ${cid} not found`})

        const cart = await cm.updateProducsInCart(cid, products)
        return response.status(200).send({status:'success', payload:cart})
    } catch (error) {
        console.log(error);
    }

})

routerC.put('/:cid/product/:pid', async (request, response) => {
    try {
        
        let { cid, pid } = request.params
        const { quantity } = request.body
        
        
        const checkIdProduct = await pm.getProductById(pid);
        if ('error' in checkIdProduct) return response.status(404).send({error: `The ID product: ${pid} not found`})
        
        const checkIdCart = await cm.getCartById(cid)
        
        if (checkIdCart === null || 'reason' in checkIdCart) return response.status(404).send({error: `The ID cart: ${cid} not found`})
        const result = checkIdCart.products.findIndex(product => product._id._id.toString() === pid)
        
        if(result === -1) return response.status(404).send({status: 'error', payload:null, message:`the product with ID: ${pid} cannot be updated because it is not in the cart`})
        
        if (isNaN(Number(quantity))||!Number.isInteger(quantity)) return response.status(400).send({status:'error', payload:null, message: 'The quantity is not valid'})
        
        if (quantity < 1) return response.status(400).send({status:'error', payload:null, message:'The quantity must be greater than 1'})

        checkIdCart.products[result].quantity = quantity


        const cart = await cm.updateOneProduct(cid, checkIdCart.products)
        
    } catch (error) {
        console.log(error);
    }
})


routerC.delete('/:cid', async (request, response) => {
    try {
        const {cid} = request.params
        const checkIdCart = await cm.getCartById(cid)
        
        if (checkIdCart === null || 'reason' in checkIdCart) return response.status(404).send({error: `The ID cart: ${cid} not found`})

        if (checkIdCart.products.length === 0) return response.status(404).send({status: 'error', payload:null, message: 'The cart is already empty'})

        checkIdCart.products = []
        
        const cart = await cm.updateOneProduct(cid, checkIdCart.products)
        return response.status(200).send({status:'success', message:`the cart whit ID: ${cid} was emptied correctly `, cart});
        
    } catch (error) {
        console.log(error);
    }
})


export default routerC