import { Router} from 'express';
import CartManager from '../DAO/mongo/managers/carts.js';
import ProductManager from '../DAO/mongo/managers/products.js';

const routerC = Router()

const cm = new CartManager()
const pm = new ProductManager()

// ENDPOINT Auxiliar para corroborar todos los carritos y hacer diferentes pruebas
routerC.get('/', async (req, res) => {
    const result = await cm.getCarts()
    return res.status(200).send(result)
})

// ENDPOINT Que devuelve un carrito
routerC.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        
        const result = await cm.getCartById(cid)
        
        // Si el resultado del GET tiene la propiedad 'CastError' devuelve un error
        if(result === null || typeof(result) === 'string') return res.status(404).send({status:'error', message: 'ID not found' });
        

        // Resultado
        return res.status(200).send(result);
    } catch (err) {
        console.log(err);
    }

})

// ENDPOINT para crear un carrito con o sin productos
routerC.post('/', async (req, res) => {
    try {
        const { products } = req.body

        
        if (!Array.isArray(products)) return res.status(400).send({ status: 'error', message: 'TypeError' });

        // Corroborar si todos los ID de los productos existen
        const results = await Promise.all(products.map(async (product) => {
            const checkId = await pm.getProductById(product._id);
            if (checkId === null || typeof(checkId) === 'string') return res.status(404).send({status: 'error', message: `The ID product: ${product._id} not found`})
        }))

        const check = results.find(value => value !== undefined)
        if (check) return res.status(404).send(check)

        const cart = await cm.addCart(products)
        
                
        res.status(200).send(cart);

    }
    catch (err) {
        console.log(err);
    }
})

// ENDPOINT para colocar la cantidad de un producto
routerC.post('/:cid/product/:pid', async (req, res) => {
    try {
        
        let { cid, pid } = req.params
        const { quantity } = req.body
        
        if (isNaN(Number(quantity))||!Number.isInteger(quantity)) return res.status(400).send({status:'error', payload:null, message: 'The quantity is not valid'})
        
        if (quantity < 1) return res.status(400).send({status:'error', payload:null, message:'The quantity must be greater than 1'})
        
        const checkIdProduct = await pm.getProductById(pid);
        

        if (checkIdProduct === null || typeof(checkIdProduct) === 'string') return res.status(404).send({status: 'error', message: `The ID product: ${pid} not found`})
    
        const checkIdCart = await cm.getCartById(cid)

        if (checkIdCart === null || typeof(checkIdCart) === 'string') return res.status(404).send({status: 'error', message: `The ID cart: ${cid} not found`})
    
        const result = await cm.addProductInCart(cid, { _id: pid, quantity })
        
        return res.status(200).send({message:`added product ID: ${pid}, in cart ID: ${cid}`, cart: result});

    } catch (error) {
        console.log(error);
    }
})


// ENDPOINT que actualiza la lista de productos 
routerC.put('/:cid', async (req, res) =>{
    try {
        const { cid } = req.params
        const {products} = req.body
        
        const results = await Promise.all(products.map(async (product) => {
            const checkId = await pm.getProductById(product._id);
            
            if (checkId === null || typeof(checkId) === 'string') {
                return res.status(404).send({status: 'error', message: `The ID product: ${product._id} not found`})
            }
        }))
        const check = results.find(value => value !== undefined)
        if (check) return res.status(404).send(check)

    
        const checkIdCart = await cm.getCartById(cid)
        if (checkIdCart === null || typeof(checkIdCart) === 'string') return res.status(404).send({status: 'error', message: `The ID cart: ${cid} not found`})
        
        const cart = await cm.updateProductsInCart(cid, products)
        return res.status(200).send({status:'success', payload:cart})
    } catch (error) {
        console.log(error);
    }
    
})

routerC.put('/:cid/product/:pid', async (req, res) => {
    try {
        
        let { cid, pid } = req.params
        const { quantity } = req.body
        
        console.log(quantity, 'quantity');
        const checkIdProduct = await pm.getProductById(pid);
        console.log('checkIdProduct', checkIdProduct);
        if (checkIdProduct === null || typeof(checkIdProduct) === 'string') return res.status(404).send({status: 'error', message: `The ID product: ${pid} not found`})
        
        const checkIdCart = await cm.getCartById(cid)
        
        console.log('checkIdCart', checkIdCart);
        if (checkIdCart === null || typeof(checkIdCart) === 'string') return res.status(404).send({error: `The ID cart: ${cid} not found`})
        
        const result = checkIdCart.products.findIndex(product => product._id._id.toString() === pid)
        console.log('result', result);
        
        if(result === -1) return res.status(404).send({status: 'error', payload:null, message:`the product with ID: ${pid} cannot be updated because it is not in the cart`})
        
        if (isNaN(Number(quantity))||!Number.isInteger(quantity)) return res.status(400).send({status:'error', payload:null, message: 'The quantity is not valid'})
        
        if (quantity < 1) return res.status(400).send({status:'error', payload:null, message:'The quantity must be greater than 1'})
        
        checkIdCart.products[result].quantity = quantity
        
        
        const cart = await cm.updateOneProduct(cid, checkIdCart.products)
        res.status(200).send({status:'success', cart})
        
    } catch (error) {
        console.log(error);
    }
})


// ENDPOINT que elimina un producto dado
routerC.delete('/:cid/product/:pid', async (req, res) =>{
    try {
        
        const { cid, pid } = req.params

        const checkIdProduct = await pm.getProductById(pid);

        if (checkIdProduct === null || typeof(checkIdProduct) === 'string') return res.status(404).send({status: 'error', message: `The ID product: ${pid} not found`})
    
        const checkIdCart = await cm.getCartById(cid)
        if (checkIdCart === null || typeof(checkIdCart) === 'string') return res.status(404).send({status: 'error', message: `The ID cart: ${cid} not found`})
        
        const findProduct = checkIdCart.products.findIndex((element) => element._id._id.toString() === checkIdProduct._id.toString())
    
        if(findProduct === -1) return res.status(404).send({error: `The ID product: ${pid} not found in cart`})
        
        checkIdCart.products.splice(findProduct, 1)
        
        const cart = await cm.deleteProductInCart(cid, checkIdCart.products)    
    
        return res.status(200).send({status:'success', message:`deleted product ID: ${pid}`, cart })
    } catch (error) {
        console.log(err);
    }
})

// ENDPOINT que elimina todos los productos de un carrito
routerC.delete('/:cid', async (req, res) => {
    try {
        const {cid} = req.params
        const checkIdCart = await cm.getCartById(cid)
        
        if (checkIdCart === null || typeof(checkIdCart) === 'string') return res.status(404).send({error: `The ID cart: ${cid} not found`})
        
        if (checkIdCart.products.length === 0) return res.status(404).send({status: 'error', payload:null, message: 'The cart is already empty'})
        
        checkIdCart.products = []
        
        const cart = await cm.updateOneProduct(cid, checkIdCart.products)
        return res.status(200).send({status:'success', message:`the cart whit ID: ${cid} was emptied correctly `, cart});
        
    } catch (error) {
        console.log(error);
    }
})


export default routerC