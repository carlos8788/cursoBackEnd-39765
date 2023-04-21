import { Router } from 'express';
import CartManager from '../DAO/CartManager.js';

const routerC = Router()

const cm = new CartManager()


routerC.get('/:cid', async (request, response) => {
    try {
        const { cid } = request.params

        // Consulta si el parámetro es un número ya que el ID es numérico
        if (isNaN(Number(cid))) {
            return response.status(400).send({ status: 'Error', message: 'Invalid identification' });
        }

        // Se devuelve el resultado
        const result = await cm.getCartById(Number(cid))
        // console.log(result);
        // Si el valor de status es 'error' devuelve un error
        if (result.status === 'error') return response.status(400).send({ result });

        // Resultado
        return response.status(200).send({ result });
    } catch (err) {
        console.log(err);
    }

})


routerC.post('/', async (request, response) => {
    try {
        const cart = request.body

        if (!Array.isArray(cart)) return response.status(400).send({ status: 'error', message: 'TypeError' });

        if (cart.length === 0) return response.status(400).send({ status: 'error', message: 'The cart is empty' })

        const result = await cm.addCart(cart)

        if (result.status === 'error') return response.status(400).send({ result });

        return response.status(200).send({ result });
    }
    catch (err) {
        console.log(err);
    }
})

routerC.post('/:cid/product/:pid', async (request, response) => {
    let { cid, pid } = request.params
    const quantity = request.body
    console.log(quantity);
    const result = await cm.addProductInCart(Number(cid), [{id:Number(pid), quantity: quantity.quantity}])
    return response.status(200).send({ result });
})





export default routerC