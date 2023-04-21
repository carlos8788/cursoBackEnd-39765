import { Router } from 'express';
import ProductManager from '../DAO/ProductManager.js';

const routerP = Router()

const pm = new ProductManager()


//http://localhost:8080/api/products?limit=2
routerP.get('/', async (request, response) => {
    try {
        //Limit recibido
        let { limit } = request.query

        // Productos
        const products = await pm.getProducts();

        // Si no se pasa un limit devuelve todos los productos
        if (!limit) return response.status(200).send({ products })

        // parseo de limit
        if (isNaN(Number(limit))) return response.status(400).send({ status: 'error', message: 'The limit is invalid' })
        limit = Number(limit)

        // Si el límite es menor a la cantidad de productos disponibles entra al condicional
        if (products.length > limit) {
            const limitProduct = products.slice(0, limit)
            return response.status(200).send({ limitProduct });
        }

        // Caso de que el limit sea mayor a lo disponible
        return response.status(200).send({ products });
    } catch (err) {
        console.log(err);
    }


})

routerP.get('/:pid', async (request, response) => {
    try {
        const { pid } = request.params

        // Consulta si el parámetro es un número ya que el ID es numérico
        if (isNaN(Number(pid))) {
            return response.status(400).send({ status: 'Error', message: 'Invalid identification' });
        }

        // Se devuelve el resultado
        const result = await pm.getProductById(pid)

        // Si el valor de status es 'error' devuelve un error
        if (result.status === 'error') return response.status(400).send({ result });

        // Resultado
        return response.status(200).send({ result });
    } catch (err) {
        console.log(err);
    }

})

routerP.post('/', async (request, response) => {
    try {
        const product = request.body

        const result = await pm.addProduct(product)

        if (result.status === 'error') return response.status(400).send({ result });

        return response.status(200).send({ result });
    }
    catch (err) {
        console.log(err);
    }
})

routerP.put('/:pid', async (request, response) => {
    try {
        const { pid } = request.params
        const product = request.body

        const result = await pm.updateProduct(Number(pid), product)

        if (result.status === 'error') return response.status(400).send({ result });

        return response.status(200).send({ result })
    }
    catch (err) {
        console.log(err);
    }
    ;

})

routerP.delete('/:pid', async (request, response) => {
    try {
        const { pid } = request.params
        const result = await pm.deleteProduct(Number(pid))

        if (result.status === 'error') return response.status(400).send({ result });

        return response.status(200).send({ result });

    } catch (err) {
        console.log(err);
    }
})

export default routerP